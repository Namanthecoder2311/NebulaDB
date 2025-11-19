import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = [
      { id: '1', type: 'success', message: 'Database backup completed successfully', timestamp: '2 minutes ago' },
      { id: '2', type: 'info', message: 'New user registration: alice@example.com', timestamp: '5 minutes ago' },
      { id: '3', type: 'warning', message: 'High CPU usage detected on server-02', timestamp: '10 minutes ago' },
      { id: '4', type: 'error', message: 'Failed to connect to backup storage', timestamp: '15 minutes ago' },
    ]

    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}