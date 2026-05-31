-- =============================================
-- NEWERA CRM - Complete Database Schema
-- Last updated: 2026
-- Run in pgAdmin Query Tool on a fresh database
-- =============================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    username VARCHAR(100) UNIQUE,
    profile_image_url TEXT,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'proprietor', 'staff')),
    department TEXT,
    title TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to_id INTEGER NOT NULL REFERENCES users(id),
    assigned_by_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'reassigned')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    due_date TIMESTAMP,
    completion_level INTEGER NOT NULL DEFAULT 0 CHECK (completion_level >= 0 AND completion_level <= 100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'leave')),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    work_hours DECIMAL(4, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LEAVES
CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK (type IN ('sick', 'casual', 'vacation', 'emergency', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by_id INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    receipt_url TEXT,
    approved_by_id INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    address TEXT,
    status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('active', 'renewal', 'lead', 'pitch', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MONTHLY SUMMARIES
CREATE TABLE IF NOT EXISTS monthly_summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    in_progress_tasks INTEGER DEFAULT 0,
    pending_tasks INTEGER DEFAULT 0,
    attendance_days INTEGER DEFAULT 0,
    leave_days INTEGER DEFAULT 0,
    total_expenses DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSURANCE PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('life', 'health', 'motor', 'travel', 'home', 'business')),
    motor_condition TEXT CHECK (motor_condition IN ('new', 'old')) DEFAULT 'new',
    motor_brand VARCHAR(100),
    motor_model VARCHAR(100),
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

-- =============================================
-- NEW: MOTOR INSURANCE LEADS
-- =============================================
CREATE TABLE IF NOT EXISTS motor_leads (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50),
    customer_name VARCHAR(200),
    referral VARCHAR(200),
    package_due_date DATE,          -- Single package renewal date
    saod_due_date DATE,             -- Standalone Own Damage due date
    tp_due_date DATE,               -- Third Party due date
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(200),
    reg_no VARCHAR(50),
    idv DECIMAL(12, 2),             -- Insurance Declared Value
    contact VARCHAR(20),
    email VARCHAR(255),
    pan VARCHAR(10),
    aadhaar VARCHAR(12),
    insurer_2024 VARCHAR(150),
    insurer_2025 VARCHAR(150),
    insurer_2026 VARCHAR(150),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'renewed', 'lost')),
    -- 5 admin-configurable custom fields (enabled/labelled via admin_custom_fields table)
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

-- =============================================
-- NEW: HEALTH INSURANCE LEADS
-- =============================================
CREATE TABLE IF NOT EXISTS health_leads (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(200),
    members TEXT,   -- JSON: [{relation, dob, height, weight}]
    contact VARCHAR(20),
    email VARCHAR(255),
    current_insurer VARCHAR(100),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'renewed', 'lost')),
    assigned_to_id INTEGER REFERENCES users(id),
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NEW: ADMIN CUSTOM FIELDS CONFIG
-- Controls which of the 5 blank fields are visible in each module
-- =============================================
CREATE TABLE IF NOT EXISTS admin_custom_fields (
    id SERIAL PRIMARY KEY,
    module TEXT NOT NULL CHECK (module IN ('motor', 'health')),
    field_number INTEGER NOT NULL,          -- 1 to 5
    label VARCHAR(100) NOT NULL DEFAULT 'Custom Field',
    is_enabled BOOLEAN DEFAULT FALSE,
    field_type TEXT DEFAULT 'text' CHECK (field_type IN ('text', 'date', 'number')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NEW: QUOTATIONS (saved motor + health quotes)
-- =============================================
CREATE TABLE IF NOT EXISTS quotations (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('motor', 'health', 'commercial')),
    customer_name VARCHAR(200),
    vehicle_or_details TEXT,
    due_date DATE,
    quotation_data TEXT NOT NULL,   -- Full JSON blob of the quotation
    motor_lead_id INTEGER REFERENCES motor_leads(id),
    health_lead_id INTEGER REFERENCES health_leads(id),
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SEED DEFAULT DATA
-- =============================================

-- Default admin user  (login: admin / admin123)
INSERT INTO users (email, password, first_name, last_name, username, role)
VALUES ('admin', 'admin123', 'System', 'Admin', 'admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Default staff user  (login: user / user123)
INSERT INTO users (email, password, first_name, last_name, username, role)
VALUES ('user', 'user123', 'Staff', 'User', 'user', 'staff')
ON CONFLICT (email) DO NOTHING;

-- 5 custom fields for Motor module (all disabled by default)
INSERT INTO admin_custom_fields (module, field_number, label, is_enabled, field_type)
VALUES
    ('motor', 1, 'Custom Field 1', false, 'text'),
    ('motor', 2, 'Custom Field 2', false, 'text'),
    ('motor', 3, 'Custom Field 3', false, 'text'),
    ('motor', 4, 'Custom Field 4', false, 'text'),
    ('motor', 5, 'Custom Field 5', false, 'text'),
    ('health', 1, 'Custom Field 1', false, 'text'),
    ('health', 2, 'Custom Field 2', false, 'text'),
    ('health', 3, 'Custom Field 3', false, 'text'),
    ('health', 4, 'Custom Field 4', false, 'text'),
    ('health', 5, 'Custom Field 5', false, 'text')
ON CONFLICT DO NOTHING;
