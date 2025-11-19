import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', lastLogin: '2 hours ago', databases: 5 },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', lastLogin: '1 day ago', databases: 3 },
      { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'suspended', lastLogin: '1 week ago', databases: 0 },
      { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'pending', lastLogin: 'Never', databases: 1 },
    ]

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}