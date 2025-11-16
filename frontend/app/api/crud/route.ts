import { NextResponse } from 'next/server'

let records = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
]

export async function GET() {
  return NextResponse.json({ records })
}

export async function POST(request: Request) {
  const body = await request.json()
  const record = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    created_at: new Date().toISOString()
  }
  records.push(record)
  return NextResponse.json({ record })
}
