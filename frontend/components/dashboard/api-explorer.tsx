'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Play, Copy, Globe } from 'lucide-react'

interface APIEndpoint {
  table: string
  endpoints: Array<{
    method: string
    path: string
  }>
}

interface APIExplorerProps {
  databaseId: string
}

export default function APIExplorer({ databaseId }: APIExplorerProps) {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('GET')
  const [requestBody, setRequestBody] = useState('{}')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (databaseId) {
      fetchEndpoints()
    }
  }, [databaseId])

  const fetchEndpoints = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/databases/${databaseId}/api/endpoints`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setEndpoints(data)
      }
    } catch (error) {
      console.error('Failed to fetch endpoints:', error)
    }
  }

  const testEndpoint = async () => {
    if (!selectedEndpoint) return

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const options: RequestInit = {
        method: selectedMethod,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      if (selectedMethod !== 'GET' && selectedMethod !== 'DELETE') {
        options.body = requestBody
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${selectedEndpoint}`, options)
      const data = await res.json()
      
      setResponse({
        status: res.status,
        data: data
      })
    } catch (error) {
      setResponse({
        status: 500,
        data: { error: 'Request failed' }
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateCurlCommand = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080'
    let curl = `curl -X ${selectedMethod} "${baseUrl}${selectedEndpoint}"`
    curl += ` -H "Authorization: Bearer YOUR_TOKEN"`
    
    if (selectedMethod !== 'GET' && selectedMethod !== 'DELETE') {
      curl += ` -H "Content-Type: application/json"`
      curl += ` -d '${requestBody}'`
    }
    
    return curl
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            API Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {endpoints.length === 0 ? (
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Endpoints</h3>
              <p className="text-gray-500">Create tables with API enabled to see endpoints here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Endpoint</label>
                  <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((ep) =>
                        ep.endpoints.map((endpoint) => (
                          <SelectItem key={endpoint.path} value={endpoint.path}>
                            {endpoint.method} {endpoint.path}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(selectedMethod === 'POST' || selectedMethod === 'PUT') && (
                <div>
                  <label className="text-sm font-medium">Request Body</label>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={testEndpoint} disabled={!selectedEndpoint || loading}>
                  <Play className="mr-2 h-4 w-4" />
                  {loading ? 'Testing...' : 'Test Request'}
                </Button>
                
                <Button variant="outline" onClick={() => copyToClipboard(generateCurlCommand())}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy cURL
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Response</CardTitle>
              <Badge variant={response.status < 400 ? 'default' : 'destructive'}>
                {response.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.map((ep) => (
              <div key={ep.table} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Table: {ep.table}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {ep.endpoints.map((endpoint) => (
                    <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-center space-x-2">
                      <Badge variant="outline">{endpoint.method}</Badge>
                      <code className="text-xs">{endpoint.path}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}