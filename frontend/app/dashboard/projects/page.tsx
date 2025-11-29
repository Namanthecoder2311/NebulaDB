'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Database, Calendar, MoreHorizontal } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  created_at: string
  databases?: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const router = useRouter()

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim() || submitting) return

    const tempId = `temp-${Date.now()}`
    const tempProject: Project = {
      id: tempId,
      name: newProject.name,
      description: newProject.description,
      created_at: new Date().toISOString(),
      databases: 0,
    }

    // Optimistic UI: add temp project immediately
    setProjects((prev) => [tempProject, ...prev])
    setSubmitting(true)

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      })

      if (response.ok) {
        const project = await response.json()
        // Replace temp project with server-provided project
        setProjects((prev) => [project, ...prev.filter((p) => p.id !== tempId)])
        setNewProject({ name: '', description: '' })
        setCreateOpen(false)
        setNotice({ type: 'success', message: 'Project created successfully' })
      } else {
        // rollback optimistic update
        setProjects((prev) => prev.filter((p) => p.id !== tempId))
        const errText = await response.text().catch(() => 'Server error')
        setNotice({ type: 'error', message: `Failed to create project: ${errText}` })
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      setProjects((prev) => prev.filter((p) => p.id !== tempId))
      setNotice({ type: 'error', message: 'Failed to create project (network error)' })
    } finally {
      setSubmitting(false)
      // auto-dismiss notice
      setTimeout(() => setNotice(null), 4000)
    }
  }

  const quickCreate = async () => {
    if (submitting) return
    setNewProject({ name: 'Untitled Project', description: '' })
    setCreateOpen(true)
    // allow user to edit, or create immediately without modal:
    // createProject will be triggered when user submits. For quick create without modal, you could
    // call createProject directly with a synthetic event, but to keep semantics clear we just open modal.
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage your database projects</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <Button variant="ghost" onClick={quickCreate} className="ml-2">
            Quick Create
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your databases
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !newProject.name.trim()}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notice && (
        <div className={`mt-4 p-3 rounded ${notice.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notice.message}
        </div>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Get started by creating your first project to organize your databases
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{project.description || 'No description'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Database className="mr-1 h-4 w-4" />
                    {project.databases || 0} databases
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push(`/dashboard/databases?project=${project.id}`)}>
                    Open Project
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/settings?project=${project.id}`)}>
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}