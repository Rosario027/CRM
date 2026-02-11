import { Router, Request, Response } from 'express';
import { db } from '../db';
import { clients } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// GET /api/clients - Get all clients
router.get('/', async (req: Request, res: Response) => {
    try {
        const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt));
        res.json({ success: true, data: allClients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch clients' });
    }
});

// POST /api/clients - Add a new client
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, company, address } = req.body;

    if (!name || !email) {
        res.status(400).json({ success: false, message: 'Name and Email are required' });
        return;
    }

    try {
        const newClient = await db.insert(clients).values({
            name,
            email,
            phone,
            company,
            address,
            status: (req.body.status as any) || 'lead'
        }).returning();

        res.status(201).json({ success: true, data: newClient[0], message: 'Client added successfully' });
    } catch (error) {
        console.error('Error adding client:', error);
        // Handle unique constraint error for email
        if ((error as any).code === '23505') {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }
        res.status(500).json({ success: false, message: 'Failed to add client' });
    }
});

// PUT /api/clients/:id - Update client
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, phone, company, address, status } = req.body;

    try {
        const updatedClient = await db.update(clients)
            .set({
                name,
                email,
                phone,
                company,
                address,
                status,
                updatedAt: new Date()
            })
            .where(eq(clients.id, parseInt(id as string)))
            .returning();

        if (updatedClient.length === 0) {
            res.status(404).json({ success: false, message: 'Client not found' });
            return;
        }

        res.json({ success: true, data: updatedClient[0], message: 'Client updated successfully' });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ success: false, message: 'Failed to update client' });
    }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await db.delete(clients)
            .where(eq(clients.id, parseInt(id as string)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ success: false, message: 'Client not found' });
            return;
        }

        res.json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ success: false, message: 'Failed to delete client' });
    }
});

export default router;
