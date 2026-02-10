-- Database Schema for Office Management App

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee', -- 'admin', 'manager', 'employee'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example other tables (to be expanded based on user logic)
-- CREATE TABLE ...
