import { Router, Request, Response } from 'express';
import { db } from '../db';
import { attendance, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// POST /api/attendance/check-in
router.post('/check-in', async (req: Request, res: Response): Promise<void> => {
    const { userId, notes } = req.body;

    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }

    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        // Check if already checked in
        const existingRec = await db.select()
            .from(attendance)
            .where(and(
                eq(attendance.userId, userId),
                eq(attendance.date, dateStr)
            ));

        if (existingRec.length > 0) {
            res.status(409).json({ success: false, message: 'Already checked in for today' });
            return;
        }

        // Create record
        const newRecord = await db.insert(attendance).values({
            userId,
            date: dateStr,
            status: 'present',
            checkInTime: today,
            notes: notes || '',
        }).returning();

        res.status(201).json({ success: true, data: newRecord[0], message: 'Checked in successfully' });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ success: false, message: 'Failed to check in' });
    }
});

// POST /api/attendance/check-out
router.post('/check-out', async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }

    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        // Find today's record
        const records = await db.select()
            .from(attendance)
            .where(and(
                eq(attendance.userId, userId),
                eq(attendance.date, dateStr)
            ));

        if (records.length === 0) {
            res.status(404).json({ success: false, message: 'No check-in record found for today' });
            return;
        }

        const record = records[0];
        if (record.checkOutTime) {
            res.status(409).json({ success: false, message: 'Already checked out today' });
            return;
        }

        // Calculate work hours (simple version)
        const checkIn = new Date(record.checkInTime!); // We know checkInTime exists if record exists
        const checkOut = today;
        const diffMs = checkOut.getTime() - checkIn.getTime();
        const hours = (diffMs / (1000 * 60 * 60)).toFixed(2);

        // Update record
        const updated = await db.update(attendance)
            .set({
                checkOutTime: today,
                workHours: hours
            })
            .where(eq(attendance.id, record.id))
            .returning();

        res.json({ success: true, data: updated[0], message: 'Checked out successfully' });

    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ success: false, message: 'Failed to check out' });
    }
});

// GET /api/attendance/history/:userId
router.get('/history/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const history = await db.select()
            .from(attendance)
            .where(eq(attendance.userId, parseInt(userId as string)))
            .orderBy(desc(attendance.date))
            .limit(30); // Last 30 days

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Fetch history error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance history' });
    }
});

// GET /api/attendance/today/:userId
router.get('/today/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const todayElement = new Date().toISOString().split('T')[0];
        const record = await db.select()
            .from(attendance)
            .where(and(
                eq(attendance.userId, parseInt(userId as string)),
                eq(attendance.date, todayElement)
            ));

        res.json({ success: true, data: record[0] || null });
    } catch (error) {
        console.error('Fetch today error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch status' });
    }
});

export default router;
