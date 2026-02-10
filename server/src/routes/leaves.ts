import { Router, Request, Response } from 'express';
import { db } from '../db';
import { leaves, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// GET /api/leaves - Get leaves (Staff: Own, Admin: All)
router.get('/', async (req: Request, res: Response) => {
    const { userId, role } = req.query;

    try {
        let query = db.select({
            id: leaves.id,
            userId: leaves.userId,
            type: leaves.type,
            startDate: leaves.startDate,
            endDate: leaves.endDate,
            reason: leaves.reason,
            status: leaves.status,
            createdAt: leaves.createdAt,
            userName: users.firstName,
            userLastName: users.lastName
        })
            .from(leaves)
            .leftJoin(users, eq(leaves.userId, users.id));

        if (role === 'staff' && userId) {
            // @ts-ignore
            query = query.where(eq(leaves.userId, parseInt(userId as string)));
        }

        // @ts-ignore
        const allLeaves = await query.orderBy(desc(leaves.createdAt));

        const formattedLeaves = allLeaves.map((l: any) => ({
            ...l,
            userName: `${l.userName} ${l.userLastName}`
        }));

        res.json({ success: true, data: formattedLeaves });
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaves' });
    }
});

// POST /api/leaves - Request a leave
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { userId, type, startDate, endDate, reason } = req.body;

    if (!userId || !type || !startDate || !endDate) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    try {
        const newLeave = await db.insert(leaves).values({
            userId,
            type,
            startDate: startDate, // Pass as string 'YYYY-MM-DD'
            endDate: endDate,     // Pass as string 'YYYY-MM-DD'
            days: diffDays,
            reason,
            status: 'pending'
        }).returning();

        res.status(201).json({ success: true, data: newLeave[0], message: 'Leave requested successfully' });
    } catch (error) {
        console.error('Error requesting leave:', error);
        res.status(500).json({ success: false, message: 'Failed to request leave' });
    }
});

// PUT /api/leaves/:id/status - Approve/Reject leave
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status' });
        return;
    }

    try {
        const updatedLeave = await db.update(leaves)
            .set({ status })
            .where(eq(leaves.id, parseInt(id as string)))
            .returning();

        if (updatedLeave.length === 0) {
            res.status(404).json({ success: false, message: 'Leave request not found' });
            return;
        }

        res.json({ success: true, data: updatedLeave[0], message: `Leave request ${status}` });
    } catch (error) {
        console.error('Error updating leave:', error);
        res.status(500).json({ success: false, message: 'Failed to update leave status' });
    }
});

export default router;
