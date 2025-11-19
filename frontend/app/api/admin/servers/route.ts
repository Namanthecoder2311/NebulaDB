import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const servers = [
      { 
        name: 'US-East-1', 
        status: 'online', 
        cpu: Math.floor(Math.random() * 60) + 20, 
        memory: Math.floor(Math.random() * 40) + 40, 
        uptime: '99.9%' 
      },
      { 
        name: 'EU-West-1', 
        status: 'online', 
        cpu: Math.floor(Math.random() * 50) + 25, 
        memory: Math.floor(Math.random() * 35) + 45, 
        uptime: '99.8%' 
      },
      { 
        name: 'Asia-Pacific', 
        status: 'online', 
        cpu: Math.floor(Math.random() * 45) + 30, 
        memory: Math.floor(Math.random() * 30) + 50, 
        uptime: '99.7%' 
      },
    ]

    return NextResponse.json(servers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 })
  }
}