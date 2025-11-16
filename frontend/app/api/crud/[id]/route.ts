import { NextResponse } from 'next/server'

let records = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const record = records.find(r => r.id === params.id)
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ record })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const index = records.findIndex(r => r.id === params.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  records[index] = { ...records[index], ...body }
  return NextResponse.json({ record: records[index] })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  records = records.filter(r => r.id !== params.id)
  return NextResponse.json({ success: true })
}
