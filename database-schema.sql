-- NebulaDB Database Schema

-- Create database
CREATE DATABASE nebuladb;

-- Note: After creating the database, manually connect to 'nebuladb' in pgAdmin before running the rest

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project members table
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Databases table
CREATE TABLE databases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    storage_size_gb INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    connection_string TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT ARRAY['read'],
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System Events table
CREATE TABLE system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample admin user
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@nebuladb.com', '$2b$10$hash', 'admin');

-- Insert sample projects
INSERT INTO projects (name, description, owner_id) VALUES 
('Sample Project', 'A sample project for testing', (SELECT id FROM users WHERE email = 'admin@nebuladb.com'));

-- User tables for tracking database tables
CREATE TABLE user_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    database_id UUID REFERENCES databases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schema_name VARCHAR(255) DEFAULT 'public',
    columns JSONB,
    indexes JSONB,
    api_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample databases
INSERT INTO databases (name, project_id, storage_size_gb, status) VALUES 
('production_db', (SELECT id FROM projects WHERE name = 'Sample Project'), 5, 'active'),
('staging_db', (SELECT id FROM projects WHERE name = 'Sample Project'), 2, 'active');