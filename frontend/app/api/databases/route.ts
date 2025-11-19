import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nebuladb',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT d.*, p.name as project_name 
      FROM databases d 
      LEFT JOIN projects p ON d.project_id = p.id 
      ORDER BY d.created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch databases' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, project_id, storage_size_gb } = await request.json()
    
    const result = await pool.query(
      'INSERT INTO databases (name, project_id, storage_size_gb, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [name, project_id, storage_size_gb || 1, 'provisioning']
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create database' }, { status: 500 })
  }
}