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

const client = new pg.Client({
    connectionString: connectionString || "postgres://dummy:dummy@localhost:5432/dummy",
});

// Connect to the database
client.connect().then(() => {
    console.log("Connected to PostgreSQL database");
    isDbConnected = true;
}).catch((err) => {
    console.warn("Failed to connect to database. App will run in offline mode.", err.message);
    isDbConnected = false;
});

export const db = drizzle(client, { schema });
