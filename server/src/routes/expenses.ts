import { Router, Request, Response } from 'express';
import { db } from '../db';
import { expenses, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// GET /api/expenses - Get expenses (Staff: Own, Admin: All)
router.get('/', async (req: Request, res: Response) => {
    const { userId, role } = req.query;

    try {
        let query = db.select({
            id: expenses.id,
            userId: expenses.userId,
            amount: expenses.amount,
            category: expenses.category,
            description: expenses.description,
            receiptUrl: expenses.receiptUrl,
            status: expenses.status,
            date: expenses.date,
            createdAt: expenses.createdAt,
            userName: users.firstName,
            userLastName: users.lastName
        })
            .from(expenses)
            .leftJoin(users, eq(expenses.userId, users.id));

        if (role === 'staff' && userId) {
            // @ts-ignore
            query = query.where(eq(expenses.userId, parseInt(userId as string)));
        }

        // @ts-ignore
        const allExpenses = await query.orderBy(desc(expenses.createdAt));

        const formattedExpenses = allExpenses.map((e: any) => ({
            ...e,
            userName: `${e.userName} ${e.userLastName}`
        }));

        res.json({ success: true, data: formattedExpenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch expenses' });
    }
});

// POST /api/expenses - Submit an expense
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { userId, amount, category, description, date } = req.body;

    if (!userId || !amount || !category || !date) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }

    try {
        const newExpense = await db.insert(expenses).values({
            userId,
            amount: amount.toString(), // Ensure decimal is string
            category,
            description,
            date: date, // Pass as string 'YYYY-MM-DD'
            status: 'pending'
        }).returning();

        res.status(201).json({ success: true, data: newExpense[0], message: 'Expense submitted successfully' });
    } catch (error) {
        console.error('Error submitting expense:', error);
        res.status(500).json({ success: false, message: 'Failed to submit expense' });
    }
});

// PUT /api/expenses/:id/status - Approve/Reject expense
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status' });
        return;
    }

    try {
        const updatedExpense = await db.update(expenses)
            .set({ status })
            .where(eq(expenses.id, parseInt(id as string)))
            .returning();

        if (updatedExpense.length === 0) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }

        res.json({ success: true, data: updatedExpense[0], message: `Expense ${status}` });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ success: false, message: 'Failed to update expense status' });
    }
});

export default router;
