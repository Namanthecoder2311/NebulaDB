'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Copy, Download } from 'lucide-react'

interface APITesterProps {
  endpoint: string
  method: string
  tableName: string
}

export default function APITester({ endpoint, method, tableName }: APITesterProps) {
  const [params, setParams] = useState<Record<string, string>>({})
  const [body, setBody] = useState('{}')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const sampleBodies = {
    users: {
      POST: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }, null, 2),
      PUT: JSON.stringify({ name: 'John Smith', email: 'john.smith@example.com' }, null, 2)
    },
    products: {
      POST: JSON.stringify({ name: 'New Product', price: 29.99, category: 'electronics' }, null, 2),
      PUT: JSON.stringify({ name: 'Updated Product', price: 39.99 }, null, 2)
    }
  }

  const executeRequest = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      let url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
      
      // Add query parameters for GET requests
      if (method === 'GET' && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params)
        url += `?${queryParams.toString()}`
      }

      const options: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      if (method !== 'GET' && method !== 'DELETE') {
        options.body = body
      }

      const res = await fetch(url, options)
      const data = await res.json()
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
        headers: Object.fromEntries(res.headers.entries())
      })
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        data: { error: 'Failed to execute request' },
        headers: {}
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleBody = () => {
    const sample = sampleBodies[tableName as keyof typeof sampleBodies]?.[method as 'POST' | 'PUT']
    if (sample) {
      setBody(sample)
    }
  }

  const exportResponse = () => {
    if (!response) return
    
    const exportData = {
      request: {
        method,
        url: endpoint,
        params,
        body: method !== 'GET' && method !== 'DELETE' ? JSON.parse(body) : null
      },
      response: response
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-test-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <Badge variant="outline" className="mr-2">{method}</Badge>
              {endpoint}
            </CardTitle>
            <Button onClick={executeRequest} disabled={loading}>
              <Play className="mr-2 h-4 w-4" />
              {loading ? 'Testing...' : 'Send Request'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="params" className="space-y-4">
            <TabsList>
              <TabsTrigger value="params">Parameters</TabsTrigger>
              {(method === 'POST' || method === 'PUT') && (
                <TabsTrigger value="body">Request Body</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="params">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Parameter name"
                    value={params.limit || ''}
                    onChange={(e) => setParams({...params, limit: e.target.value})}
                  />
                  <Input
                    placeholder="Value (e.g., 10)"
                    value={params.limit || ''}
                    onChange={(e) => setParams({...params, limit: e.target.value})}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Common parameters: limit, offset, filter, sort
                </p>
              </div>
            </TabsContent>
            
            {(method === 'POST' || method === 'PUT') && (
              <TabsContent value="body">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">JSON Body</label>
                    <Button variant="outline" size="sm" onClick={loadSampleBody}>
                      Load Sample
                    </Button>
                  </div>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter JSON request body"
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                Response
                <Badge 
                  variant={response.status < 400 ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {response.status} {response.statusText}
                </Badge>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={exportResponse}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="body">
              <TabsList>
                <TabsTrigger value="body">Response Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="body">
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm max-h-96">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="headers">
                <div className="space-y-2">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">{key}</span>
                      <span className="text-gray-600">{value as string}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}