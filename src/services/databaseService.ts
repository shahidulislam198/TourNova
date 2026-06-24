import * as SQLite from "expo-sqlite";
import { Trip, TripDay } from "../types/trip";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("tournova.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        destination TEXT NOT NULL,
        days INTEGER NOT NULL,
        budget TEXT NOT NULL,
        interests TEXT NOT NULL,
        travelers INTEGER NOT NULL,
        plan TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }
  return db;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function saveTrip(params: {
  destination: string;
  days: number;
  budget: string;
  interests: string;
  travelers: number;
  plan: TripDay[];
}): Promise<string> {
  const database = await getDb();
  const id = generateId();
  const createdAt = new Date().toISOString();

  await database.runAsync(
    `INSERT INTO trips (id, destination, days, budget, interests, travelers, plan, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      params.destination,
      params.days,
      params.budget,
      params.interests,
      params.travelers,
      JSON.stringify(params.plan),
      createdAt,
    ],
  );

  return id;
}

export async function getTrip(id: string): Promise<Trip | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{
    id: string;
    destination: string;
    days: number;
    budget: string;
    interests: string;
    travelers: number;
    plan: string;
    createdAt: string;
  }>(`SELECT * FROM trips WHERE id = ?`, [id]);

  if (!row) return null;

  return {
    ...row,
    plan: JSON.parse(row.plan),
  };
}

export async function getAllTrips(): Promise<Trip[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    destination: string;
    days: number;
    budget: string;
    interests: string;
    travelers: number;
    plan: string;
    createdAt: string;
  }>(`SELECT * FROM trips ORDER BY createdAt DESC`);

  return rows.map((row) => ({
    ...row,
    plan: JSON.parse(row.plan),
  }));
}

export async function deleteTrip(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(`DELETE FROM trips WHERE id = ?`, [id]);
}
