import { Router, Request, Response } from 'express';
import { db, isDbConnected } from '../db';
import { users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// GET /api/staff - Get all staff members
router.get('/', async (req: Request, res: Response) => {
    try {
        // Fetch all users sorted by creation date descending
        const allStaff = await db.select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            employeeId: users.employeeId,
            username: users.username,
            role: users.role,
            department: users.department,
            title: users.title,
            isActive: users.isActive,
            createdAt: users.createdAt,
        })
            .from(users)
            .orderBy(desc(users.createdAt));

        res.json({ success: true, data: allStaff });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch staff list' });
    }
});

// POST /api/staff - Create a new staff member
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, role, department, title, password, employeeId, username } = req.body;

    if (!firstName || !lastName || !email || !password || !employeeId) {
        res.status(400).json({ success: false, message: 'Missing required fields: firstName, lastName, email, password, employeeId' });
        return;
    }

    // Check database connection
    if (!isDbConnected) {
        res.status(503).json({ success: false, message: 'Database connection not available. Please try again later.' });
        return;
    }

    try {
        // Check if user already exists by email
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            res.status(409).json({ success: false, message: 'User with this email already exists' });
            return;
        }

        // Check if employeeId already exists
        const existingEmployeeId = await db.select().from(users).where(eq(users.employeeId, employeeId));
        if (existingEmployeeId.length > 0) {
            res.status(409).json({ success: false, message: 'Employee ID already exists' });
            return;
        }

        // Insert new user
        // Note: Password should be hashed in production. Storing plain for MVP as requested.
        const newUser = await db.insert(users).values({
            firstName,
            lastName,
            email,
            password, // TODO: Hash this
            username: username || firstName, // Default username to firstName
            role: role || 'staff',
            department,
            title,
            employeeId,
            isActive: true,
        }).returning({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role
        });

        res.status(201).json({ success: true, data: newUser[0], message: 'Staff member added successfully' });
    } catch (error: any) {
        console.error('Error creating staff:', error);
        console.error('Error details:', error.detail || error.message || error.code); // Log DB error details
        res.status(500).json({
            success: false,
            message: 'Failed to create staff member',
            error: error.message // Send specific error to client for debugging
        });
    }
});

// DELETE /api/staff/:id - Delete a staff member (admin only)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);

    try {
        // Prevent deleting admin accounts
        const user = await db.select({ role: users.role, email: users.email }).from(users).where(eq(users.id, id));
        if (user.length === 0) {
            res.status(404).json({ success: false, message: 'Staff member not found' });
            return;
        }
        if (user[0].role === 'admin' || user[0].email === 'admin') {
            res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
            return;
        }

        await db.delete(users).where(eq(users.id, id));
        res.json({ success: true, message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ success: false, message: 'Failed to delete staff member' });
    }
});

export default router;
