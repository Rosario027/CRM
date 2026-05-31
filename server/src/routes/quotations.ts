import { Router, Request, Response } from 'express';
import { db, isDbConnected } from '../db';
import { quotations } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const type = req.query.type as string | undefined;
        let query = db.select().from(quotations).orderBy(desc(quotations.createdAt));
        const results = await query;
        res.json(type ? results.filter(q => q.type === type) : results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch quotations' });
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const id = parseInt(req.params.id as string);
        const [q] = await db.select().from(quotations).where(eq(quotations.id, id));
        if (!q) { res.status(404).json({ error: 'Not found' }); return; }
        res.json(q);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quotation' });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const data = req.body;
        const [q] = await db.insert(quotations).values({
            type: data.type,
            customerName: data.customerName,
            vehicleOrDetails: data.vehicleOrDetails,
            dueDate: data.dueDate || null,
            quotationData: typeof data.quotationData === 'string' ? data.quotationData : JSON.stringify(data.quotationData),
            motorLeadId: data.motorLeadId || null,
            healthLeadId: data.healthLeadId || null,
            createdById: data.createdById || null,
        }).returning();
        res.status(201).json(q);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save quotation' });
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const id = parseInt(req.params.id as string);
        await db.delete(quotations).where(eq(quotations.id, id));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete quotation' });
    }
});

export default router;
