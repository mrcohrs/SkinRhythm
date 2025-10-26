import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import type { Express } from "express";
import { storage } from "./storage";

export function setupLocalAuth(app: Express) {
  // Configure local strategy (session handling already set up by setupAuth)
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user || !user.passwordHash) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Return user in format compatible with session
          // Set expires_at to 7 days from now (matching session TTL)
          const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
          return done(null, { 
            claims: { 
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
            },
            expires_at: expiresAt,
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUserWithPassword(email, passwordHash, firstName);

      // Log the user in
      // Set expires_at to 7 days from now (matching session TTL)
      const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
      req.login({ 
        claims: { 
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
        },
        expires_at: expiresAt,
      }, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in" });
        }
        // Explicitly save session before responding to ensure it's persisted
        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({ message: "Error saving session" });
          }
          res.json({ 
            id: user.id,
            email: user.email,
            firstName: user.firstName,
          });
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Error creating account" });
    }
  });

  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in" });
        }
        
        // Explicitly save session before responding to ensure it's persisted
        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({ message: "Error saving session" });
          }
          // Return user data
          res.json({
            id: user.claims.sub,
            email: user.claims.email,
            firstName: user.claims.first_name,
          });
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    });
  });
}
