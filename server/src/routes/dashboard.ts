import { Router, Request, Response } from 'express';
import { db } from '../db';
import { tasks, users } from '../db/schema';
import { sql, and, eq, gt, or } from 'drizzle-orm';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
    const { userId, role } = req.query;

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let userFilter = undefined;
        if (role === 'staff' && userId) {
            userFilter = eq(tasks.assignedToId, parseInt(userId as string));
        }

        // Run ALL queries in parallel for speed
        const [tasksLast7Days, highPending, mediumPending, lowPending, totalStaffResult] = await Promise.all([
            db.select({ count: sql<number>`count(*)` })
                .from(tasks)
                .where(and(gt(tasks.createdAt, sevenDaysAgo), userFilter)),

            db.select({ count: sql<number>`count(*)` })
                .from(tasks)
                .where(and(eq(tasks.status, 'pending'), or(eq(tasks.priority, 'high'), eq(tasks.priority, 'critical')), userFilter)),

            db.select({ count: sql<number>`count(*)` })
                .from(tasks)
                .where(and(eq(tasks.status, 'pending'), eq(tasks.priority, 'medium'), userFilter)),

            db.select({ count: sql<number>`count(*)` })
                .from(tasks)
                .where(and(eq(tasks.status, 'pending'), eq(tasks.priority, 'low'), userFilter)),

            db.select({ count: sql<number>`count(*)` })
                .from(users)
                .where(eq(users.isActive, true))
        ]);

        res.json({
            success: true,
            data: {
                tasksLast7Days: Number(tasksLast7Days[0].count),
                totalStaff: Number(totalStaffResult[0].count),
                pendingTasks: {
                    high: Number(highPending[0].count),
                    medium: Number(mediumPending[0].count),
                    low: Number(lowPending[0].count),
                    total: Number(highPending[0].count) + Number(mediumPending[0].count) + Number(lowPending[0].count)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
});

export default router;
