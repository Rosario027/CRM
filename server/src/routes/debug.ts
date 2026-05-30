import { Router, Request, Response } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// GET /api/debug/schema - Get the schema for the users table
router.get('/schema', async (req: Request, res: Response) => {
    try {
        const result = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        res.json({ success: true, columns: result.rows });
    } catch (error: any) {
        console.error('Error fetching schema:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch schema', error: error.message });
    }
});

export default router;
