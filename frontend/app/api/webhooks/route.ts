import { NextResponse } from 'next/server'

export async function GET() {
  const webhooks = [
    { id: 1, name: 'Slack Notifications', url: 'https://hooks.slack.com/...', events: ['backup.completed'], active: true },
  ]
  return NextResponse.json({ webhooks })
}

export async function POST(request: Request) {
  const { name, url, events } = await request.json()
  const webhook = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    url,
    events,
    active: true
  }
  return NextResponse.json({ webhook })
}
