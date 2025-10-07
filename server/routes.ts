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

  const httpServer = createServer(app);
  return httpServer;
}
