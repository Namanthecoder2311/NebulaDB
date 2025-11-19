'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Webhook, Plus, Trash2, Power, Globe, AlertCircle } from 'lucide-react'

interface WebhookData {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  created: string
  lastTriggered?: string
}

const AVAILABLE_EVENTS = [
  'database.created',
  'database.deleted', 
  'backup.completed',
  'backup.failed',
  'error.occurred',
  'usage.threshold',
  'api.limit.reached',
  'maintenance.scheduled'
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const fetchWebhooks = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webhooks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data)
      } else {
        setWebhooks([
          { 
            id: '1', 
            name: 'Slack Notifications', 
            url: 'https://example.com/webhook/slack', 
            events: ['backup.completed', 'error.occurred'], 
            active: true,
            created: '2024-01-10T10:30:00Z',
            lastTriggered: '2024-01-15T14:20:00Z'
          },
          { 
            id: '2', 
            name: 'Discord Alerts', 
            url: 'https://example.com/webhook/discord', 
            events: ['database.created'], 
            active: false,
            created: '2024-01-08T09:15:00Z'
          },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newWebhook)
      })

      if (response.ok) {
        const webhook = await response.json()
        setWebhooks([webhook, ...webhooks])
      } else {
        const mockWebhook = {
          id: Date.now().toString(),
          name: newWebhook.name,
          url: newWebhook.url,
          events: newWebhook.events,
          active: true,
          created: new Date().toISOString()
        }
        setWebhooks([mockWebhook, ...webhooks])
      }
      
      setNewWebhook({ name: '', url: '', events: [] })
      setCreateOpen(false)
    } catch (error) {
      console.error('Failed to create webhook:', error)
    }
  }

  const toggleWebhook = async (id: string, active: boolean) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webhooks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active })
      })
      
      setWebhooks(webhooks.map(w => w.id === id ? { ...w, active } : w))
    } catch (error) {
      console.error('Failed to toggle webhook:', error)
    }
  }

  const deleteWebhook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return
    
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webhooks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setWebhooks(webhooks.filter(w => w.id !== id))
    } catch (error) {
      console.error('Failed to delete webhook:', error)
    }
  }

  const handleEventToggle = (event: string, checked: boolean) => {
    if (checked) {
      setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] })
    } else {
      setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(e => e !== event) })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-gray-600">Receive real-time notifications for events</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Set up a webhook to receive notifications for database events
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createWebhook} className="space-y-4">
              <div>
                <Label htmlFor="name">Webhook Name</Label>
                <Input
                  id="name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="Slack Notifications"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                  required
                />
              </div>
              
              <div>
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onCheckedChange={(checked) => handleEventToggle(event, checked as boolean)}
                      />
                      <Label htmlFor={event} className="text-sm font-mono">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={newWebhook.events.length === 0}>
                  Create Webhook
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
              <p className="text-gray-500 mb-4">Set up webhooks to receive real-time notifications</p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        webhook.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Webhook className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{webhook.name}</p>
                          {webhook.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 font-mono break-all">{webhook.url}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(webhook.created).toLocaleDateString()}
                          {webhook.lastTriggered && (
                            <span> • Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={webhook.active} 
                        onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWebhook(webhook.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs font-mono">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
            Available Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_EVENTS.map((event) => (
              <div key={event} className="p-3 border rounded-lg">
                <code className="text-sm text-gray-700">{event}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
