import { Router, Request, Response } from 'express';
import { db } from '../db';
import { products } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// GET /api/products - Get all active products (everyone can see)
router.get('/', async (req: Request, res: Response) => {
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

        // Parse features JSON for each product
        const formatted = allProducts.map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : [],
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
});

// POST /api/products - Create a new product (admin only)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, category, description, shortDescription, premiumStarting, coverageAmount, duration, features, terms, createdById,
        motorCondition, motorBrand, motorModel } = req.body;

    if (!name || !category || !description || !premiumStarting || !coverageAmount) {
        res.status(400).json({ success: false, message: 'Missing required fields: name, category, description, premiumStarting, coverageAmount' });
        return;
    }

    if (category === 'motor') {
        if (!motorCondition || !motorBrand || !motorModel) {
            res.status(400).json({ success: false, message: 'Motor products require condition, brand and model' });
            return;
        }
    }

    try {
        const newProduct = await db.insert(products).values({
            name,
            category,
            // include motor-specific if provided
            ...(motorCondition && { motorCondition }),
            ...(motorBrand && { motorBrand }),
            ...(motorModel && { motorModel }),
            description,
            shortDescription: shortDescription || description.substring(0, 120) + '...',
            premiumStarting,
            coverageAmount,
            duration: duration || '1 Year',
            features: features ? JSON.stringify(features) : '[]',
            terms,
            isActive: true,
            createdById: createdById || null,
        }).returning();

        res.status(201).json({ success: true, data: newProduct[0], message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Failed to create product' });
    }
});

// PUT /api/products/:id - Update a product (admin only)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, category, description, shortDescription, premiumStarting, coverageAmount, duration, features, terms, isActive,
        motorCondition, motorBrand, motorModel } = req.body;

    // if category is being updated to motor, ensure condition, brand, and model are provided
    if (category === 'motor') {
        if (!motorCondition || !motorBrand || !motorModel) {
            res.status(400).json({ success: false, message: 'Motor products require condition, brand and model' });
            return;
        }
    }

    try {
        const updated = await db.update(products)
            .set({
                ...(name && { name }),
                ...(category && { category }),
                ...(motorCondition && { motorCondition }),
                ...(motorBrand && { motorBrand }),
                ...(motorModel && { motorModel }),
                ...(description && { description }),
                ...(shortDescription && { shortDescription }),
                ...(premiumStarting && { premiumStarting }),
                ...(coverageAmount && { coverageAmount }),
                ...(duration && { duration }),
                ...(features && { features: JSON.stringify(features) }),
                ...(terms !== undefined && { terms }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date(),
            })
            .where(eq(products.id, parseInt(id as string)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        res.json({ success: true, data: updated[0], message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete a product (admin only)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await db.delete(products)
            .where(eq(products.id, parseInt(id as string)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

export default router;
