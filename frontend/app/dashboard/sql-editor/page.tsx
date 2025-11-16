'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SQLEditor from '@/components/sql-editor/sql-editor'
import TableSchemaViewer from '@/components/dashboard/table-schema'
import { Database, Code, Table } from 'lucide-react'

interface Database {
  id: string
  name: string
  project_id: string
  status: string
}

interface Project {
  id: string
  name: string
}

export default function SQLEditorPage() {
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
          <h1 className="text-3xl font-bold">SQL Editor</h1>
          <p className="text-gray-600">Execute SQL queries on your databases</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Connection
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
                      {db.name} ({db.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDatabase ? (
        <Tabs defaultValue="editor" className="space-y-4">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              SQL Editor
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center">
              <Table className="mr-2 h-4 w-4" />
              Schema
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <SQLEditor databaseId={selectedDatabase} />
          </TabsContent>
          
          <TabsContent value="schema">
            <TableSchemaViewer databaseId={selectedDatabase} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Database Selected</h3>
              <p className="text-gray-500">Select a project and database to start writing SQL queries</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}