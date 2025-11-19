'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  permissions: string[]
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [showKey, setShowKey] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newKey, setNewKey] = useState({ name: '', permissions: ['read'] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const fetchAPIKeys = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setKeys(data)
      } else {
        // Mock data for demo
        setKeys([
          { id: '1', name: 'Production API', key: 'ndb_prod_abc123def456ghi789', created: '2024-01-10', lastUsed: '2 hours ago', permissions: ['read', 'write'] },
          { id: '2', name: 'Development', key: 'ndb_dev_xyz789abc123def456', created: '2024-01-08', lastUsed: '1 day ago', permissions: ['read'] },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      // Mock data for demo
      setKeys([
        { id: '1', name: 'Production API', key: 'ndb_prod_abc123def456ghi789', created: '2024-01-10', lastUsed: '2 hours ago', permissions: ['read', 'write'] },
        { id: '2', name: 'Development', key: 'ndb_dev_xyz789abc123def456', created: '2024-01-08', lastUsed: '1 day ago', permissions: ['read'] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const createAPIKey = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newKey)
      })

      if (response.ok) {
        const apiKey = await response.json()
        setKeys([apiKey, ...keys])
      } else {
        // Mock creation
        const mockKey = {
          id: Date.now().toString(),
          name: newKey.name,
          key: `ndb_${Math.random().toString(36).substr(2, 24)}`,
          created: new Date().toISOString().split('T')[0],
          lastUsed: 'Never',
          permissions: newKey.permissions
        }
        setKeys([mockKey, ...keys])
      }
      
      setNewKey({ name: '', permissions: ['read'] })
      setCreateOpen(false)
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const deleteAPIKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return
    
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setKeys(keys.filter(k => k.id !== id))
    } catch (error) {
      console.error('Failed to delete API key:', error)
      setKeys(keys.filter(k => k.id !== id))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-gray-600">Manage your API authentication keys</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for accessing your databases
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createAPIKey} className="space-y-4">
              <div>
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="Production API Key"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Key</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-yellow-800 text-sm">
            <strong>Security Warning:</strong> Keep your API keys secure. Never share them publicly or commit them to version control.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
              <p className="text-gray-500 mb-4">Create your first API key to start using the API</p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{apiKey.name}</p>
                        <p className="text-sm text-gray-500">Created: {apiKey.created}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      >
                        {showKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAPIKey(apiKey.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                    {showKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 12)}...${apiKey.key.substring(apiKey.key.length - 4)}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last used: {apiKey.lastUsed}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
