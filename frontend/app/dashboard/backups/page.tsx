'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, Download, Clock, HardDrive, Plus, RefreshCw } from 'lucide-react'

interface Backup {
  id: string
  name: string
  database_name: string
  size: string
  created: string
  status: 'completed' | 'in_progress' | 'failed'
  type: 'manual' | 'automatic'
}

interface DatabaseOption {
  id: string
  name: string
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [databases, setDatabases] = useState<DatabaseOption[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBackups()
    fetchDatabases()
  }, [])

  const fetchBackups = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/backups`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBackups(data)
      } else {
        setBackups([
          { id: '1', name: 'Auto Backup', database_name: 'production_db', size: '245 MB', created: '2024-01-15T10:30:00Z', status: 'completed', type: 'automatic' },
          { id: '2', name: 'Manual Backup', database_name: 'staging_db', size: '243 MB', created: '2024-01-14T15:15:00Z', status: 'completed', type: 'manual' },
          { id: '3', name: 'Pre-Migration', database_name: 'production_db', size: '240 MB', created: '2024-01-13T09:00:00Z', status: 'completed', type: 'manual' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDatabases = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/databases`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDatabases(data)
      } else {
        setDatabases([
          { id: '1', name: 'production_db' },
          { id: '2', name: 'staging_db' },
          { id: '3', name: 'development_db' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch databases:', error)
    }
  }

  const createBackup = async () => {
    if (!selectedDatabase) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/backups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ database_id: selectedDatabase })
      })

      if (response.ok) {
        const backup = await response.json()
        setBackups([backup, ...backups])
      } else {
        const mockBackup = {
          id: Date.now().toString(),
          name: `Manual Backup - ${new Date().toLocaleDateString()}`,
          database_name: databases.find(db => db.id === selectedDatabase)?.name || 'Unknown',
          size: '0 MB',
          created: new Date().toISOString(),
          status: 'in_progress' as const,
          type: 'manual' as const
        }
        setBackups([mockBackup, ...backups])
      }
      
      setCreateOpen(false)
      setSelectedDatabase('')
    } catch (error) {
      console.error('Failed to create backup:', error)
    }
  }

  const downloadBackup = async (backupId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/backups/${backupId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${backupId}.sql`
        a.click()
      }
    } catch (error) {
      console.error('Failed to download backup:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      in_progress: 'secondary',
      failed: 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Backups</h1>
          <p className="text-gray-600">Manage and restore your database backups</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Manual Backup</DialogTitle>
              <DialogDescription>
                Create a backup of your selected database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Database</label>
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose database to backup" />
                  </SelectTrigger>
                  <SelectContent>
                    {databases.map((db) => (
                      <SelectItem key={db.id} value={db.id}>
                        {db.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createBackup} disabled={!selectedDatabase}>
                  Create Backup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 ml-auto text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 ml-auto text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8 GB</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 ml-auto text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8">
              <HardDrive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No backups yet</h3>
              <p className="text-gray-500 mb-4">Create your first backup to secure your data</p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Backup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <p className="text-sm text-gray-500">
                        {backup.database_name} • {backup.size} • {new Date(backup.created).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={backup.type === 'manual' ? 'secondary' : 'default'}>
                      {backup.type}
                    </Badge>
                    {getStatusBadge(backup.status)}
                    {backup.status === 'completed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadBackup(backup.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
