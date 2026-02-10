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

app.post('/api/login', (req: Request, res: Response): void => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, role: 'admin', message: 'Login successful' });
        return;
    }

    if (username === 'user' && password === 'user123') {
        res.json({ success: true, role: 'employee', message: 'Login successful' });
        return;
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
