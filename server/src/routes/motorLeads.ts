import { Router, Request, Response } from 'express';
import { db, isDbConnected } from '../db';
import { motorLeads } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// GET all motor leads
router.get('/', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const leads = await db.select().from(motorLeads).orderBy(desc(motorLeads.createdAt));
        res.json(leads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch motor leads' });
    }
});

// POST create
router.post('/', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const data = req.body;
        const [lead] = await db.insert(motorLeads).values({
            source: data.source,
            customerName: data.customerName,
            referral: data.referral,
            packageDueDate: data.packageDueDate || null,
            saodDueDate: data.saodDueDate || null,
            tpDueDate: data.tpDueDate || null,
            vehicleMake: data.vehicleMake,
            vehicleModel: data.vehicleModel,
            regNo: data.regNo,
            idv: data.idv ? String(data.idv) : null,
            contact: data.contact,
            email: data.email,
            pan: data.pan,
            aadhaar: data.aadhaar,
            insurer2024: data.insurer2024,
            insurer2025: data.insurer2025,
            insurer2026: data.insurer2026,
            status: data.status || 'open',
            customField1: data.customField1,
            customField2: data.customField2,
            customField3: data.customField3,
            customField4: data.customField4,
            customField5: data.customField5,
            assignedToId: data.assignedToId || null,
            createdById: data.createdById || null,
        }).returning();
        res.status(201).json(lead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create motor lead' });
    }
});

// PUT update
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const id = parseInt(req.params.id as string);
        const data = req.body;
        const [lead] = await db.update(motorLeads).set({
            source: data.source,
            customerName: data.customerName,
            referral: data.referral,
            packageDueDate: data.packageDueDate || null,
            saodDueDate: data.saodDueDate || null,
            tpDueDate: data.tpDueDate || null,
            vehicleMake: data.vehicleMake,
            vehicleModel: data.vehicleModel,
            regNo: data.regNo,
            idv: data.idv ? String(data.idv) : null,
            contact: data.contact,
            email: data.email,
            pan: data.pan,
            aadhaar: data.aadhaar,
            insurer2024: data.insurer2024,
            insurer2025: data.insurer2025,
            insurer2026: data.insurer2026,
            status: data.status,
            customField1: data.customField1,
            customField2: data.customField2,
            customField3: data.customField3,
            customField4: data.customField4,
            customField5: data.customField5,
            assignedToId: data.assignedToId || null,
            updatedAt: new Date(),
        }).where(eq(motorLeads.id, id)).returning();
        res.json(lead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update motor lead' });
    }
});

// DELETE
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const id = parseInt(req.params.id as string);
        await db.delete(motorLeads).where(eq(motorLeads.id, id));
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete motor lead' });
    }
});

export default router;
