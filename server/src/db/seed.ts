import { db } from './index';
import { users } from './schema';
import { eq, sql } from 'drizzle-orm';

export async function seed() {
    console.log('Seeding database...');

    try {
        // SELF-HEALING: Ensure required columns exist
        console.log('Checking database schema...');
        await db.execute(sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='employee_id') THEN 
                    ALTER TABLE users ADD COLUMN "employee_id" VARCHAR(50) UNIQUE; 
                    RAISE NOTICE 'Added employee_id column';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN 
                    ALTER TABLE users ADD COLUMN "username" VARCHAR(100) UNIQUE; 
                    RAISE NOTICE 'Added username column';
                END IF;
            END $$;
        `);

        // Self-healing: Create products table if it doesn't exist
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL,
                short_description TEXT,
                premium_starting DECIMAL(10, 2) NOT NULL,
                coverage_amount DECIMAL(12, 2) NOT NULL,
                duration VARCHAR(50),
                features TEXT,
                terms TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_by_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Schema verification passed.');

        // Check if admin exists
        const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin'));

        if (existingAdmin.length === 0) {
            console.log('Creating admin user...');
            await db.insert(users).values({
                email: 'admin',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                username: 'admin',
                role: 'admin',
                employeeId: 'ADMIN001',
                department: 'Management',
                title: 'Proprietor',
                isActive: true
            });
        } else {
            console.log('Admin user exists. Updating role and ID...');
            // Force update to ensure correct role and ID
            await db.update(users)
                .set({
                    role: 'admin',
                    employeeId: 'ADMIN001',
                    isActive: true
                })
                .where(eq(users.email, 'admin'));
        }

        // Check if staff exists
        const existingStaff = await db.select().from(users).where(eq(users.email, 'user'));

        if (existingStaff.length === 0) {
            console.log('Creating staff user...');
            await db.insert(users).values({
                email: 'user',
                password: 'user123',
                firstName: 'John',
                lastName: 'Doe',
                username: 'John',
                role: 'staff',
                department: 'Operations',
                title: 'Associate'
            });
        } else {
            console.log('Staff user already exists.');
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seeding failed:', err);
    }
}
