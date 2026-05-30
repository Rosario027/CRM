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
        // Create new insurance tables
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS motor_leads (
                id SERIAL PRIMARY KEY,
                source VARCHAR(50),
                customer_name VARCHAR(200),
                referral VARCHAR(200),
                package_due_date DATE,
                saod_due_date DATE,
                tp_due_date DATE,
                vehicle_make VARCHAR(100),
                vehicle_model VARCHAR(200),
                reg_no VARCHAR(50),
                idv DECIMAL(12,2),
                contact VARCHAR(20),
                email VARCHAR(255),
                pan VARCHAR(10),
                aadhaar VARCHAR(12),
                insurer_2024 VARCHAR(150),
                insurer_2025 VARCHAR(150),
                insurer_2026 VARCHAR(150),
                status TEXT DEFAULT 'open',
                custom_field_1 TEXT,
                custom_field_2 TEXT,
                custom_field_3 TEXT,
                custom_field_4 TEXT,
                custom_field_5 TEXT,
                assigned_to_id INTEGER REFERENCES users(id),
                created_by_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS health_leads (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(200),
                members TEXT,
                contact VARCHAR(20),
                email VARCHAR(255),
                current_insurer VARCHAR(100),
                status TEXT DEFAULT 'open',
                assigned_to_id INTEGER REFERENCES users(id),
                created_by_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS admin_custom_fields (
                id SERIAL PRIMARY KEY,
                module TEXT NOT NULL,
                field_number INTEGER NOT NULL,
                label VARCHAR(100) NOT NULL DEFAULT 'Custom Field',
                is_enabled BOOLEAN DEFAULT FALSE,
                field_type TEXT DEFAULT 'text',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS quotations (
                id SERIAL PRIMARY KEY,
                type TEXT NOT NULL,
                customer_name VARCHAR(200),
                vehicle_or_details TEXT,
                due_date DATE,
                quotation_data TEXT NOT NULL,
                motor_lead_id INTEGER REFERENCES motor_leads(id),
                health_lead_id INTEGER REFERENCES health_leads(id),
                created_by_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed default custom fields if none exist
        const existingFields = await db.execute(sql`SELECT COUNT(*) FROM admin_custom_fields`);
        const fieldCount = parseInt((existingFields.rows[0] as any).count);
        if (fieldCount === 0) {
            for (const mod of ['motor', 'health']) {
                for (let i = 1; i <= 5; i++) {
                    await db.execute(sql`INSERT INTO admin_custom_fields (module, field_number, label, is_enabled, field_type) VALUES (${mod}, ${i}, ${'Custom Field ' + i}, false, 'text')`);
                }
            }
        }

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
