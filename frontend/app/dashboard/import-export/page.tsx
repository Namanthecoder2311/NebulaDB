'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Download, FileJson, FileText, Database, File } from 'lucide-react'

interface DatabaseOption {
  id: string
  name: string
}

interface TableOption {
  name: string
}

interface ExportHistory {
  id: string
  name: string
  size: string
  created: string
  format: string
}

export default function ImportExportPage() {
  const [databases, setDatabases] = useState<DatabaseOption[]>([])
  const [tables, setTables] = useState<TableOption[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState('')
  const [selectedTable, setSelectedTable] = useState('')
  const [exportFormat, setExportFormat] = useState('json')
  const [importFormat, setImportFormat] = useState('json')
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    fetchDatabases()
    fetchExportHistory()
  }, [])

  useEffect(() => {
    if (selectedDatabase) {
      fetchTables(selectedDatabase)
    }
  }, [selectedDatabase])

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
    } finally {
      setLoading(false)
    }
  }

  const fetchTables = async (databaseId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/databases/${databaseId}/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      } else {
        setTables([
          { name: 'users' },
          { name: 'products' },
          { name: 'orders' },
          { name: 'categories' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    }
  }

  const fetchExportHistory = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exports`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setExportHistory(data)
      } else {
        setExportHistory([
          { id: '1', name: 'production_db_backup.json', size: '45 MB', created: '2024-01-15T10:30:00Z', format: 'json' },
          { id: '2', name: 'users_table.csv', size: '2.3 MB', created: '2024-01-14T15:15:00Z', format: 'csv' },
          { id: '3', name: 'full_database.sql', size: '120 MB', created: '2024-01-13T09:00:00Z', format: 'sql' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch export history:', error)
    }
  }

  const handleExport = async () => {
    if (!selectedDatabase) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          database_id: selectedDatabase,
          table: selectedTable || null,
          format: exportFormat
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `export-${Date.now()}.${exportFormat}`
        a.click()
        fetchExportHistory()
      }
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const handleImport = async (file: File) => {
    if (!selectedDatabase || !file) return
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('database_id', selectedDatabase)
    formData.append('format', importFormat)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        alert('Data imported successfully!')
      }
    } catch (error) {
      console.error('Failed to import data:', error)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleImport(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImport(files[0])
    }
  }

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'json': return <FileJson className="h-5 w-5 text-blue-600" />
      case 'csv': return <FileText className="h-5 w-5 text-green-600" />
      case 'sql': return <Database className="h-5 w-5 text-purple-600" />
      default: return <File className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Import / Export Data</h1>
        <p className="text-gray-600">Transfer data between databases and files</p>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5 text-blue-600" />
                Import Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Database</label>
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose database" />
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

              <div>
                <label className="text-sm font-medium">File Format</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['json', 'csv', 'sql'].map((format) => (
                    <Button
                      key={format}
                      variant={importFormat === format ? 'default' : 'outline'}
                      onClick={() => setImportFormat(format)}
                      className="uppercase"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Drop file here or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Max file size: 100MB</p>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept={`.${importFormat}`}
                  onChange={handleFileSelect}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5 text-green-600" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Database</label>
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose database" />
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

              <div>
                <label className="text-sm font-medium">Select Table (Optional)</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="All tables" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tables</SelectItem>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Export Format</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={exportFormat === 'json' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('json')}
                    className="flex flex-col h-16"
                  >
                    <FileJson className="h-6 w-6 mb-1" />
                    <span className="text-xs">JSON</span>
                  </Button>
                  <Button
                    variant={exportFormat === 'csv' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('csv')}
                    className="flex flex-col h-16"
                  >
                    <FileText className="h-6 w-6 mb-1" />
                    <span className="text-xs">CSV</span>
                  </Button>
                  <Button
                    variant={exportFormat === 'sql' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('sql')}
                    className="flex flex-col h-16"
                  >
                    <Database className="h-6 w-6 mb-1" />
                    <span className="text-xs">SQL</span>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                disabled={!selectedDatabase}
                className="w-full"
              >
                Export Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          {exportHistory.length === 0 ? (
            <div className="text-center py-8">
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exports yet</h3>
              <p className="text-gray-500">Your exported files will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exportHistory.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.format)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.size} • {new Date(file.created).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
