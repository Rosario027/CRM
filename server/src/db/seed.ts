import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function seed() {
    console.log('Seeding database...');

    // Check if admin exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin'));

    if (existingAdmin.length === 0) {
        console.log('Creating admin user...');
        await db.insert(users).values({
            email: 'admin',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
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
            role: 'staff',
            department: 'Operations',
            title: 'Associate'
        });
    } else {
        console.log('Staff user already exists.');
    }

    console.log('Seeding complete.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
