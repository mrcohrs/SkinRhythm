import {
  users,
  routines,
  type User,
  type UpsertUser,
  type Routine,
  type InsertRoutine,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  saveRoutine(routine: InsertRoutine): Promise<Routine>;
  getUserRoutines(userId: string): Promise<Routine[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
    const [savedRoutine] = await db
      .insert(routines)
      .values(routine)
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
}

export const storage = new DatabaseStorage();
