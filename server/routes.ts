import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupLocalAuth } from "./localAuth";
import { parseExcelFile, getRoutineForAnswers } from "./parseExcel";
import { quizAnswersSchema } from "@shared/schema";

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

  app.post('/api/quiz/submit', async (req, res) => {
    try {
      const validatedAnswers = quizAnswersSchema.parse(req.body);
      
      const routine = getRoutineForAnswers({
        skinType: validatedAnswers.skinType,
        fitzpatrickType: validatedAnswers.fitzpatrickType,
        acneTypes: validatedAnswers.acneTypes,
        acneSeverity: validatedAnswers.acneSeverity,
        isPregnantOrNursing: validatedAnswers.isPregnantOrNursing,
        age: validatedAnswers.age,
      });

      if (!routine) {
        return res.status(404).json({ message: "No routine found for your answers" });
      }

      res.json({
        routine,
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
      res.json(userRoutines);
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
      res.json(currentRoutine);
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
