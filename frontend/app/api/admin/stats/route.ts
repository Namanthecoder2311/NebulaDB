import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = {
      totalUsers: 247,
      activeUsers: 189,
      totalDatabases: 156,
      activeDatabases: 142,
      totalStorage: 1024,
      usedStorage: 687,
      systemHealth: 'healthy'
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}