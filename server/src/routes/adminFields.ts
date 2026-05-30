import { Router, Request, Response } from 'express';
import { db, isDbConnected } from '../db';
import { adminCustomFields } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const DEFAULT_FIELDS = [
    { module: 'motor' as const, fieldNumber: 1, label: 'Custom Field 1', isEnabled: false, fieldType: 'text' as const },
    { module: 'motor' as const, fieldNumber: 2, label: 'Custom Field 2', isEnabled: false, fieldType: 'text' as const },
    { module: 'motor' as const, fieldNumber: 3, label: 'Custom Field 3', isEnabled: false, fieldType: 'text' as const },
    { module: 'motor' as const, fieldNumber: 4, label: 'Custom Field 4', isEnabled: false, fieldType: 'text' as const },
    { module: 'motor' as const, fieldNumber: 5, label: 'Custom Field 5', isEnabled: false, fieldType: 'text' as const },
    { module: 'health' as const, fieldNumber: 1, label: 'Custom Field 1', isEnabled: false, fieldType: 'text' as const },
    { module: 'health' as const, fieldNumber: 2, label: 'Custom Field 2', isEnabled: false, fieldType: 'text' as const },
    { module: 'health' as const, fieldNumber: 3, label: 'Custom Field 3', isEnabled: false, fieldType: 'text' as const },
    { module: 'health' as const, fieldNumber: 4, label: 'Custom Field 4', isEnabled: false, fieldType: 'text' as const },
    { module: 'health' as const, fieldNumber: 5, label: 'Custom Field 5', isEnabled: false, fieldType: 'text' as const },
];

// Ensure defaults exist
const ensureDefaults = async () => {
    if (!isDbConnected) return;
    const existing = await db.select().from(adminCustomFields);
    if (existing.length === 0) {
        await db.insert(adminCustomFields).values(DEFAULT_FIELDS);
    }
};

router.get('/', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) {
        res.json(DEFAULT_FIELDS.map((f, i) => ({ id: i + 1, ...f })));
        return;
    }
    try {
        await ensureDefaults();
        const fields = await db.select().from(adminCustomFields).orderBy(adminCustomFields.fieldNumber);
        res.json(fields);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch custom fields' });
    }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected) { res.status(503).json({ error: 'DB not connected' }); return; }
    try {
        const id = parseInt(req.params.id);
        const { label, isEnabled, fieldType } = req.body;
        const [field] = await db.update(adminCustomFields).set({
            label,
            isEnabled,
            fieldType,
            updatedAt: new Date(),
        }).where(eq(adminCustomFields.id, id)).returning();
        res.json(field);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update custom field' });
    }
});

export default router;
