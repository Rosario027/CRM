import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

// Use DATABASE_URL from environment or fallback
const connectionString = process.env.DATABASE_URL;

export let isDbConnected = false;

if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set. Database features will be disabled.");
}

// Use connection pool for better performance
const pool = new pg.Pool({
    connectionString: connectionString || "postgres://dummy:dummy@localhost:5432/dummy",
    max: 20, // Max clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect().then((client) => {
    console.log("Connected to PostgreSQL database (Pool)");
    isDbConnected = true;
    client.release();
}).catch((err) => {
    console.warn("Failed to connect to database. App will run in offline mode.", err.message);
    isDbConnected = false;
});

export const db = drizzle(pool, { schema });
