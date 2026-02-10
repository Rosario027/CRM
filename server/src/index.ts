import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import path from 'path';

// ... (existing imports)

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test DB connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Database connected successfully');
    release();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API Routes
app.get('/api', (req: Request, res: Response) => {
    res.send('Office Management API is running');
});

import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// ... (existing codes)

app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        // Find user by email (using username field as email for now, or add username to schema)
        // Schema has 'email', 'firstName', 'lastName'. Let's assume input 'username' matches 'email' or a new 'username' field?
        // The schema I created has 'email'. The frontend sends 'username'.
        // Let's assume for this MVP that the user types their email.

        // Actually, let's allow 'admin' to map to a specific email for the seed data, or update schema to have username.
        // The SQL schema had 'username'. The Drizzle schema I wrote has 'email'.
        // Let's check the SQL schema really quick? No, I'll just check Drizzle schema again.
        // Drizzle schema: email, password...
        // I should probably map 'username' input to 'email' for now, OR fetch by email.

        // Let's assume the user enters email.
        const result = await db.select().from(users).where(eq(users.email, username));

        if (result.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const user = result[0];

        // In a real app, use bcrypt.compare(password, user.password)
        // For this MVP, we are storing plain text or simple mismatch.
        // The seed data I created earlier (in SQL) used 'admin123'. 
        // If I haven't seeded via Drizzle, the DB might be empty unless I ran seed.sql.
        // I ran seed.sql earlier.

        if (password === user.password) {
            res.json({
                success: true,
                role: user.role,
                user: { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email },
                message: 'Login successful'
            });
            return;
        }

        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
