import { NextResponse } from 'next/server'

export async function GET() {
  const keys = [
    { id: 1, name: 'Production API', key: 'ndb_prod_abc123...', created: new Date().toISOString() },
  ]
  return NextResponse.json({ keys })
}

export async function POST(request: Request) {
  const { name } = await request.json()
  const apiKey = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    key: `ndb_${Math.random().toString(36).substr(2, 32)}`,
    created: new Date().toISOString()
  }
  return NextResponse.json({ apiKey })
}
