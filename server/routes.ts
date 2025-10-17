import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupLocalAuth } from "./localAuth";
import { parseExcelFile, getRoutineForAnswers } from "./parseExcel";
import { resolveRoutineProducts, resolveSavedRoutineProducts } from "./routineResolver";
import { quizAnswersSchema } from "@shared/schema";
import "./productAlternatives"; // Load product alternatives CSV

parseExcelFile();

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  setupLocalAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/quiz/submit', async (req: any, res) => {
    try {
      const validatedAnswers = quizAnswersSchema.parse(req.body);
      
      // Check if user is authenticated and premium
      let isPremiumUser = false;
      if (req.user && req.user.claims && req.user.claims.sub) {
        try {
          const user = await storage.getUser(req.user.claims.sub);
          isPremiumUser = user?.isPremium || false;
          console.log(`[Quiz Submit] User ${req.user.claims.sub} - isPremium: ${user?.isPremium}, will get premiumOptions: ${isPremiumUser}`);
        } catch (e) {
          console.log(`[Quiz Submit] Error getting user, treating as non-premium:`, e);
        }
      } else {
        console.log(`[Quiz Submit] No authenticated user, treating as non-premium`);
      }
      
      const routine = getRoutineForAnswers({
        skinType: validatedAnswers.skinType,
        fitzpatrickType: validatedAnswers.fitzpatrickType,
        acneTypes: validatedAnswers.acneTypes,
        acneSeverity: validatedAnswers.acneSeverity,
        isPregnantOrNursing: validatedAnswers.isPregnantOrNursing,
        age: validatedAnswers.age,
        isPremiumUser,
      });

      if (!routine) {
        return res.status(404).json({ message: "No routine found for your answers" });
      }

      // Resolve product IDs to full product objects
      const resolvedRoutine = resolveRoutineProducts(routine, isPremiumUser);

      // Log if premiumOptions are in the response
      const hasPremiumOptions = resolvedRoutine.products!.morning.some((p: any) => p.premiumOptions?.length > 0) || 
                                resolvedRoutine.products!.evening.some((p: any) => p.premiumOptions?.length > 0);
      console.log(`[Quiz Submit] Routine has premiumOptions: ${hasPremiumOptions}`);

      res.json({
        routine: resolvedRoutine,
        answers: validatedAnswers,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(400).json({ message: "Invalid quiz answers" });
    }
  });

  app.post('/api/routines/save', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, age, skinType, fitzpatrickType, acneTypes, acneSeverity, isPregnantOrNursing, routineData } = req.body;

      const savedRoutine = await storage.saveRoutine({
        userId,
        name,
        age,
        skinType,
        fitzpatrickType,
        acneTypes,
        acneSeverity,
        isPregnantOrNursing,
        routineData,
      });

      res.json(savedRoutine);
    } catch (error) {
      console.error("Error saving routine:", error);
      res.status(500).json({ message: "Failed to save routine" });
    }
  });

  app.get('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userRoutines = await storage.getUserRoutines(userId);
      
      // Get user's premium status
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || false;
      } catch (e) {
        console.log(`[Routines] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve all routines to use centralized product library
      const resolvedRoutines = userRoutines.map(routine => ({
        ...routine,
        routineData: resolveSavedRoutineProducts(routine.routineData, isPremiumUser),
      }));
      
      res.json(resolvedRoutines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Failed to fetch routines" });
    }
  });

  app.get('/api/routines/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentRoutine = await storage.getCurrentRoutine(userId);
      if (!currentRoutine) {
        return res.status(404).json({ message: "No current routine found" });
      }
      
      // Get user's premium status
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || false;
      } catch (e) {
        console.log(`[Current Routine] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve routine to use centralized product library
      const resolvedRoutine = {
        ...currentRoutine,
        routineData: resolveSavedRoutineProducts(currentRoutine.routineData, isPremiumUser),
      };
      
      res.json(resolvedRoutine);
    } catch (error) {
      console.error("Error fetching current routine:", error);
      res.status(500).json({ message: "Failed to fetch current routine" });
    }
  });

  app.post('/api/routines/:id/set-current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updatedRoutine = await storage.setCurrentRoutine(userId, id);
      res.json(updatedRoutine);
    } catch (error: any) {
      console.error("Error setting current routine:", error);
      if (error.message === "Routine not found or access denied") {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.status(500).json({ message: "Failed to set current routine" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
