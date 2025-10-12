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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(email: string, passwordHash: string, firstName?: string): Promise<User>;
  
  saveRoutine(routine: InsertRoutine): Promise<Routine>;
  getUserRoutines(userId: string): Promise<Routine[]>;
  getCurrentRoutine(userId: string): Promise<Routine | undefined>;
  setCurrentRoutine(userId: string, routineId: string): Promise<Routine>;
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
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
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
}

export const storage = new DatabaseStorage();
