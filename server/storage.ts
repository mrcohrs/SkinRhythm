import {
  users,
  routines,
  type User,
  type UpsertUser,
  type Routine,
  type InsertRoutine,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(email: string, passwordHash: string, firstName?: string): Promise<User>;
  updateUserConsent(userId: string, dataCollectionConsent: boolean, aiTrainingConsent: boolean, consentVersion: string): Promise<User>;
  
  saveRoutine(routine: InsertRoutine): Promise<Routine>;
  getUserRoutines(userId: string): Promise<Routine[]>;
  getCurrentRoutine(userId: string): Promise<Routine | undefined>;
  setCurrentRoutine(userId: string, routineId: string): Promise<Routine>;
  setCurrentProduct(userId: string, routineId: string, category: string, productName: string): Promise<Routine>;
  addRoutineNote(userId: string, routineId: string, text: string): Promise<Routine>;
  deleteRoutineNote(userId: string, routineId: string, noteId: string): Promise<Routine>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserWithPassword(email: string, passwordHash: string, firstName?: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // OIDC always provides an ID (sub claim), but check anyway
    if (userData.id) {
      // First try to find existing user by ID
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing user
        const [user] = await db
          .update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return user;
      }
    }

    // Check if email exists (handles test scenarios where email exists with different ID)
    if (userData.email) {
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (emailExists.length > 0) {
        // Update existing user (but NEVER update ID - it's immutable due to foreign key constraints)
        const [user] = await db
          .update(users)
          .set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        return user;
      }
    }

    // Insert new user
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async saveRoutine(routine: InsertRoutine): Promise<Routine> {
    // Set all existing routines to not current
    await db
      .update(routines)
      .set({ isCurrent: false })
      .where(eq(routines.userId, routine.userId));

    // Insert new routine as current
    const [savedRoutine] = await db
      .insert(routines)
      .values({ ...routine, isCurrent: true })
      .returning();
    return savedRoutine;
  }

  async getUserRoutines(userId: string): Promise<Routine[]> {
    return await db
      .select()
      .from(routines)
      .where(eq(routines.userId, userId))
      .orderBy(desc(routines.createdAt));
  }

  async getCurrentRoutine(userId: string): Promise<Routine | undefined> {
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.userId, userId), eq(routines.isCurrent, true)));
    return routine;
  }

  async setCurrentRoutine(userId: string, routineId: string): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Set all user's routines to not current
    await db
      .update(routines)
      .set({ isCurrent: false })
      .where(eq(routines.userId, userId));

    // Set specified routine as current
    const [updatedRoutine] = await db
      .update(routines)
      .set({ isCurrent: true })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async setCurrentProduct(
    userId: string, 
    routineId: string, 
    category: string, 
    productName: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current product selections or initialize empty object
    const currentSelections = (routine.currentProductSelections as Record<string, string>) || {};
    
    // Update the selection for this category
    const updatedSelections = {
      ...currentSelections,
      [category]: productName
    };

    // Update the routine with new selections
    const [updatedRoutine] = await db
      .update(routines)
      .set({ currentProductSelections: updatedSelections })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async updateUserConsent(
    userId: string,
    dataCollectionConsent: boolean,
    aiTrainingConsent: boolean,
    consentVersion: string
  ): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        dataCollectionConsent,
        aiTrainingConsent,
        consentDate: new Date(),
        consentVersion,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async addRoutineNote(
    userId: string,
    routineId: string,
    text: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current notes or initialize empty array
    const currentNotes = (routine.notes as Array<{id: string, date: string, text: string}>) || [];
    
    // Create new note
    const newNote = {
      id: randomUUID(),
      date: new Date().toISOString(),
      text
    };

    // Add new note to the beginning of the array (most recent first)
    const updatedNotes = [newNote, ...currentNotes];

    // Update the routine with new notes
    const [updatedRoutine] = await db
      .update(routines)
      .set({ notes: updatedNotes })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async deleteRoutineNote(
    userId: string,
    routineId: string,
    noteId: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current notes or initialize empty array
    const currentNotes = (routine.notes as Array<{id: string, date: string, text: string}>) || [];
    
    // Remove note with matching ID
    const updatedNotes = currentNotes.filter(note => note.id !== noteId);

    // Update the routine with filtered notes
    const [updatedRoutine] = await db
      .update(routines)
      .set({ notes: updatedNotes })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }
}

export const storage = new DatabaseStorage();
