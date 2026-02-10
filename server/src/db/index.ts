import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

// Use DATABASE_URL from environment or fallback (but realistically we need the env var)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set. Database features will not work.");
}

const client = new pg.Client({
    connectionString: connectionString,
});

// Connect to the database
client.connect().then(() => {
    console.log("Connected to PostgreSQL database");
}).catch((err) => {
    console.error("Failed to connect to database:", err);
});

export const db = drizzle(client, { schema });
