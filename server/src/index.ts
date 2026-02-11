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

import staffRoutes from './routes/staff';
import attendanceRoutes from './routes/attendance';
import taskRoutes from './routes/tasks';
import leaveRoutes from './routes/leaves';
import expenseRoutes from './routes/expenses';
import clientRoutes from './routes/clients';
import dashboardRoutes from './routes/dashboard';

// API Routes
app.get('/api', (req: Request, res: Response) => {
    res.send('Office Management API is running');
});

app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/dashboard', dashboardRoutes);

import { db, isDbConnected } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// ... (existing codes)

app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Helper for offline/fallback login
    const fallbackLogin = () => {
        // Default seed data credentials
        if (username === 'admin' && password === 'admin123') {
            res.json({ success: true, role: 'admin', user: { name: 'Admin User' }, message: 'Login successful (Offline Mode)' });
            return true;
        }
        if (username === 'user' && password === 'user123') {
            res.json({ success: true, role: 'staff', user: { name: 'Staff User' }, message: 'Login successful (Offline Mode)' });
            return true;
        }
        return false;
    };

    if (!isDbConnected) {
        console.warn('DB not connected, using fallback login.');
        if (!fallbackLogin()) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        return;
    }

    try {
        const result = await db.select().from(users).where(eq(users.email, username));

        if (result.length === 0) {
            // Try fallback if user not found in DB (migration convenience)
            if (fallbackLogin()) return;

            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const user = result[0];

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
        // Fallback on error
        if (fallbackLogin()) return;
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
