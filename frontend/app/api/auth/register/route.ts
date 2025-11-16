import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      created_at: new Date().toISOString()
    }

    const tokens = {
      access_token: 'mock_access_token_' + Math.random().toString(36).substr(2),
      refresh_token: 'mock_refresh_token_' + Math.random().toString(36).substr(2)
    }

    return NextResponse.json({ user, ...tokens })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 })
  }
}
