import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Check if we're in the build process
const isBuildProcess = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

let db: ReturnType<typeof drizzle> | null = null;

if (!isBuildProcess) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db = drizzle(connection);
}

export default db;
