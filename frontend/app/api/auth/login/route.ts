import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Check for admin credentials
    const isAdmin = email === 'admin@nebuladb.com' && password === 'admin123'
    
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: isAdmin ? 'Admin User' : 'Demo User',
      email,
      role: isAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString()
    }

    const tokens = {
      access_token: 'mock_access_token_' + Math.random().toString(36).substr(2),
      refresh_token: 'mock_refresh_token_' + Math.random().toString(36).substr(2)
    }

    return NextResponse.json({ user, ...tokens })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
