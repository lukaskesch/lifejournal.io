import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    db = drizzle(connection);
  }

  return db;
}
