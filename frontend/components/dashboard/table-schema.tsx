'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Database, Key, Plus, Edit, Trash2 } from 'lucide-react'

interface Column {
  name: string
  type: string
  nullable?: boolean
  primary_key?: boolean
  unique?: boolean
  default?: string
}

interface TableSchema {
  id: string
  name: string
  columns: Record<string, Column>
  indexes: any[]
  api_enabled: boolean
}

interface TableSchemaViewerProps {
  databaseId: string
}

export default function TableSchemaViewer({ databaseId }: TableSchemaViewerProps) {
  const [tables, setTables] = useState<TableSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<string>('')

  useEffect(() => {
    if (databaseId) {
      fetchTables()
    }
  }, [databaseId])

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/databases/${databaseId}/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTables(data)
        if (data.length > 0) {
          setSelectedTable(data[0].name)
        }
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedTableData = tables.find(t => t.name === selectedTable)

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading schema...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Schema
            </CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tables.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
              <p className="text-gray-500 mb-4">Create your first table to get started</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Table
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tables.map((table) => (
                  <Button
                    key={table.name}
                    variant={selectedTable === table.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTable(table.name)}
                  >
                    {table.name}
                    {table.api_enabled && <Badge variant="secondary" className="ml-2">API</Badge>}
                  </Button>
                ))}
              </div>

              {selectedTableData && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{selectedTableData.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Drop
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Constraints</TableHead>
                          <TableHead>Default</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(selectedTableData.columns).map(([name, column]) => (
                          <TableRow key={name}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {column.primary_key && <Key className="mr-2 h-4 w-4 text-yellow-500" />}
                                {name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{column.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {column.primary_key && <Badge variant="default">PK</Badge>}
                                {column.unique && <Badge variant="secondary">UNIQUE</Badge>}
                                {!column.nullable && <Badge variant="outline">NOT NULL</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {column.default || 'NULL'}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium">REST API</h4>
                          <p className="text-xs text-gray-600">Auto-generated endpoints for this table</p>
                        </div>
                        <Badge variant={selectedTableData.api_enabled ? 'default' : 'secondary'}>
                          {selectedTableData.api_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>

                      {selectedTableData.indexes && selectedTableData.indexes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Indexes</h4>
                          <div className="space-y-2">
                            {selectedTableData.indexes.map((index: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{index.name}</span>
                                <Badge variant="outline">{index.type || 'btree'}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}