import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, registerWebhook } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Process-level error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  // In production, we want to log but try to keep running
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  // In production, we want to log but try to keep running
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// CRITICAL: Register Stripe webhook BEFORE express.json() middleware
// Webhook needs raw body for signature verification
try {
  registerWebhook(app);
} catch (error) {
  console.error('ERROR: Failed to register webhook handler:', error);
  // Continue anyway - webhook is not critical for basic functionality
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('Starting server initialization...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', process.env.PORT || '5000');
    
    // Check critical environment variables
    if (!process.env.DATABASE_URL) {
      console.warn('WARNING: DATABASE_URL not set - database features will not work');
    }
    
    console.log('Registering routes...');
    const server = await registerRoutes(app);
    console.log('Routes registered successfully');

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('Express error handler caught:', {
        status,
        message,
        stack: err.stack
      });

      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    console.log('Setting up static file serving...');
    if (app.get("env") === "development") {
      await setupVite(app, server);
      console.log('Vite dev server setup complete');
    } else {
      serveStatic(app);
      console.log('Static file serving setup complete');
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    console.log(`Attempting to listen on port ${port}...`);
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
      console.log('✓ Server started successfully');
    }).on('error', (error: any) => {
      console.error('FATAL: Server failed to listen on port', port);
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      } else if (error.code === 'EACCES') {
        console.error(`Permission denied to bind to port ${port}`);
      }
      
      process.exit(1);
    });
    
  } catch (error: any) {
    console.error('FATAL ERROR during server startup:');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    // Log additional context
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    // Exit with error code
    process.exit(1);
  }
})();
