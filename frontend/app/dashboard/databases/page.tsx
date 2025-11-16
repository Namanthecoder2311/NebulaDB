'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Database, HardDrive, Activity, Settings } from 'lucide-react'

interface Database {
  id: string
  name: string
  project_id: string
  storage_size_gb: number
  status: string
  created_at: string
}

interface Project {
  id: string
  name: string
}

export default function DatabasesPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [databases, setDatabases] = useState<Database[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newDatabase, setNewDatabase] = useState({ name: '', storage_size_gb: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchDatabases(selectedProject)
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
        if (data.length > 0) {
          setSelectedProject(data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDatabases = async (projectId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/databases`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDatabases(data)
      }
    } catch (error) {
      console.error('Failed to fetch databases:', error)
    }
  }

  const createDatabase = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${selectedProject}/databases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newDatabase)
      })

      if (response.ok) {
        const database = await response.json()
        setDatabases([database, ...databases])
        setNewDatabase({ name: '', storage_size_gb: 1 })
        setCreateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create database:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      provisioning: 'secondary',
      suspended: 'destructive'
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
          <h1 className="text-3xl font-bold">Databases</h1>
          <p className="text-gray-600">Manage your PostgreSQL databases</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedProject}>
              <Plus className="mr-2 h-4 w-4" />
              New Database
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Database</DialogTitle>
              <DialogDescription>
                Create a new PostgreSQL database in your project
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createDatabase} className="space-y-4">
              <div>
                <Label htmlFor="name">Database Name</Label>
                <Input
                  id="name"
                  value={newDatabase.name}
                  onChange={(e) => setNewDatabase({ ...newDatabase, name: e.target.value })}
                  placeholder="my_database"
                  required
                />
              </div>
              <div>
                <Label htmlFor="storage">Storage Size (GB)</Label>
                <Select 
                  value={newDatabase.storage_size_gb.toString()} 
                  onValueChange={(value) => setNewDatabase({ ...newDatabase, storage_size_gb: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 GB</SelectItem>
                    <SelectItem value="5">5 GB</SelectItem>
                    <SelectItem value="10">10 GB</SelectItem>
                    <SelectItem value="25">25 GB</SelectItem>
                    <SelectItem value="50">50 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Database</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProject && (
        <>
          {databases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No databases yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first PostgreSQL database to get started
                </p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Database
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databases.map((database) => (
                <Card key={database.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        {database.name}
                      </CardTitle>
                      {getStatusBadge(database.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <HardDrive className="mr-1 h-4 w-4" />
                          Storage
                        </div>
                        <span>{database.storage_size_gb} GB</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Activity className="mr-1 h-4 w-4" />
                          Created
                        </div>
                        <span>{new Date(database.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Connect
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}