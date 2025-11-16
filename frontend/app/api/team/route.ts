import { NextResponse } from 'next/server'

export async function GET() {
  const members = [
    { id: 1, name: 'Devin', email: 'devin@nebuladb.com', role: 'Owner' },
    { id: 2, name: 'Rohit', email: 'rohit@nebuladb.com', role: 'Admin' },
  ]
  return NextResponse.json({ members })
}

export async function POST(request: Request) {
  const { email, role } = await request.json()
  const member = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    role,
    status: 'pending'
  }
  return NextResponse.json({ member })
}
