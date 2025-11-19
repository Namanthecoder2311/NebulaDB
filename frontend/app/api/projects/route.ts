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
      SELECT p.*, COUNT(d.id) as databases 
      FROM projects p 
      LEFT JOIN databases d ON p.id = d.project_id 
      GROUP BY p.id 
      ORDER BY p.created_at DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()
    
    const result = await pool.query(
      'INSERT INTO projects (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, description || null]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}