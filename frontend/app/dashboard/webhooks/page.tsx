'use client'

import { useState } from 'react'
import { Webhook, Plus, Trash2, Power } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function WebhooksPage() {
  const [webhooks] = useState([
    { id: 1, name: 'Slack Notifications', url: 'https://hooks.slack.com/...', events: ['backup.completed', 'error.occurred'], active: true },
    { id: 2, name: 'Discord Alerts', url: 'https://discord.com/api/webhooks/...', events: ['database.created'], active: false },
  ])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Webhooks</h1>
          <p className="text-gray-600 mt-1">Receive real-time notifications for events</p>
        </div>
        <button className="neu-button px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
          <Plus className="h-5 w-5" />
          Add Webhook
        </button>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Webhooks</h2>
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="neu-pressed p-5 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Webhook className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{webhook.name}</p>
                    <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={webhook.active} />
                  <button className="neu-button p-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {webhook.events.map((event, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                    {event}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="neu-card p-6">
        <h3 className="font-bold text-gray-800 mb-3">Available Events</h3>
        <div className="grid grid-cols-2 gap-3">
          {['database.created', 'database.deleted', 'backup.completed', 'backup.failed', 'error.occurred', 'usage.threshold'].map((event) => (
            <div key={event} className="neu-pressed p-3 rounded-lg text-sm text-gray-700 font-mono">
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
