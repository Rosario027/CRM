import { Router, Request, Response } from 'express';
import { db } from '../db';
import { tasks, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// GET /api/tasks - Get all tasks (or filter by user)
router.get('/', async (req: Request, res: Response) => {
    const { userId, role } = req.query;

    try {
        let query = db.select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            assignedToId: tasks.assignedToId,
            assignedById: tasks.assignedById,
            assignedToName: users.firstName, // We'll need a join for full name, simplified for now
            createdAt: tasks.createdAt,
        })
            .from(tasks)
            .leftJoin(users, eq(tasks.assignedToId, users.id));

        // If staff, only show their tasks
        if (role === 'staff' && userId) {
            // @ts-ignore - Dynamic query building
            query = query.where(eq(tasks.assignedToId, parseInt(userId as string)));
        }

        // @ts-ignore
        const allTasks = await query.orderBy(desc(tasks.createdAt));

        // Fetch user names for 'assignedTo' manually if join is complex, 
        // but the leftJoin above gets assignedToName (actually it gets the user's first name who is assigned)

        // Let's improve the valid data structure return
        const formattedTasks = allTasks.map((t: any) => ({
            ...t,
            assignedToName: t.assignedToName || 'Unassigned' // This is actually getting the assignee's name
        }));

        res.json({ success: true, data: formattedTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
});

// POST /api/tasks - Create a new task
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { title, description, assignedToId, assignedById, priority, dueDate } = req.body;

    if (!title || !assignedToId || !assignedById) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }

    try {
        const newTask = await db.insert(tasks).values({
            title,
            description,
            assignedToId,
            assignedById,
            priority: priority || 'medium',
            status: 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
        }).returning();

        res.status(201).json({ success: true, data: newTask[0], message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id/status - Update task status
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status' });
        return;
    }

    try {
        const updatedTask = await db.update(tasks)
            .set({ status, updatedAt: new Date() })
            .where(eq(tasks.id, parseInt(id as string)))
            .returning();

        if (updatedTask.length === 0) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        res.json({ success: true, data: updatedTask[0], message: 'Task status updated' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, message: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await db.delete(tasks)
            .where(eq(tasks.id, parseInt(id as string)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
});

export default router;
