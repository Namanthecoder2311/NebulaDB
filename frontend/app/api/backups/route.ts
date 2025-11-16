import { NextResponse } from 'next/server'

export async function GET() {
  const backups = [
    { id: 1, name: 'Auto Backup', size: '245 MB', date: new Date().toISOString(), type: 'Automatic' },
    { id: 2, name: 'Manual Backup', size: '243 MB', date: new Date().toISOString(), type: 'Manual' },
  ]
  return NextResponse.json({ backups })
}

export async function POST(request: Request) {
  const { database_id, name } = await request.json()
  const backup = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    size: '250 MB',
    date: new Date().toISOString(),
    type: 'Manual'
  }
  return NextResponse.json({ backup })
}
