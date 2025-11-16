'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import APIExplorer from '@/components/dashboard/api-explorer'
import { Globe, Code, Settings } from 'lucide-react'

interface Database {
  id: string
  name: string
  project_id: string
}

interface Project {
  id: string
  name: string
}

export default function APIPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [databases, setDatabases] = useState<Database[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedDatabase, setSelectedDatabase] = useState('')
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
        if (data.length > 0) {
          setSelectedDatabase(data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch databases:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Management</h1>
          <p className="text-gray-600">Test and manage your auto-generated REST APIs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Database Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Database</label>
              <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                <SelectTrigger>
                  <SelectValue placeholder="Select database" />
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
          </div>
        </CardContent>
      </Card>

      {selectedDatabase && (
        <Tabs defaultValue="explorer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="explorer" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              API Explorer
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explorer">
            <APIExplorer databaseId={selectedDatabase} />
          </TabsContent>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Base URL</h3>
                    <code className="text-blue-800">{process.env.NEXT_PUBLIC_API_URL}/databases/{selectedDatabase}/data</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Available Operations</h3>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">List Records</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /{'{table_name}'}</code>
                      <p className="text-sm text-gray-600 mt-1">Query parameters: limit, offset, filter, sort</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Get Single Record</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /{'{table_name}'}/{'{id}'}</code>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Create Record</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /{'{table_name}'}</code>
                      <p className="text-sm text-gray-600 mt-1">Send JSON data in request body</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Update Record</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">PUT /{'{table_name}'}/{'{id}'}</code>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Delete Record</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">DELETE /{'{table_name}'}/{'{id}'}</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}