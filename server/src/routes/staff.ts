import { Router, Request, Response } from 'express';
import { db } from '../db';
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
    const { firstName, lastName, email, role, department, title, password, employeeId } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }

    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            res.status(409).json({ success: false, message: 'User with this email already exists' });
            return;
        }

        // Insert new user
        // Note: Password should be hashed in production. Storing plain for MVP as requested.
        const newUser = await db.insert(users).values({
            firstName,
            lastName,
            email,
            password, // TODO: Hash this
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
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ success: false, message: 'Failed to create staff member' });
    }
});

export default router;
