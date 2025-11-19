'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Activity, AlertCircle, CheckCircle, Info, XCircle, Search, Download, Filter } from 'lucide-react'

interface LogEntry {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: string
  details?: string
  source: string
  userId?: string
  ipAddress?: string
}

interface LogStats {
  success: number
  error: number
  warning: number
  info: number
  total: number
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<LogStats>({ success: 0, error: 0, warning: 0, info: 0, total: 0 })
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('24h')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [timeFilter])

  useEffect(() => {
    filterLogs()
  }, [logs, typeFilter, searchTerm])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs?period=${timeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
        setStats(data.stats)
      } else {
        // Mock data
        const mockLogs = [
          { id: '1', type: 'success' as const, message: 'Database backup completed', timestamp: '2024-01-15T14:30:00Z', details: 'Backup size: 245 MB', source: 'backup-service', userId: 'user123', ipAddress: '192.168.1.100' },
          { id: '2', type: 'info' as const, message: 'New API key generated', timestamp: '2024-01-15T14:15:00Z', details: 'Key: ndb_prod_abc...', source: 'api-service', userId: 'user123', ipAddress: '192.168.1.100' },
          { id: '3', type: 'warning' as const, message: 'High CPU usage detected', timestamp: '2024-01-15T13:30:00Z', details: 'CPU: 85%', source: 'monitoring', ipAddress: '10.0.0.1' },
          { id: '4', type: 'error' as const, message: 'Connection timeout', timestamp: '2024-01-15T12:30:00Z', details: 'Retry attempt: 3/3', source: 'database', ipAddress: '10.0.0.2' },
          { id: '5', type: 'success' as const, message: 'Database created successfully', timestamp: '2024-01-15T11:30:00Z', details: 'Name: production_db', source: 'database-service', userId: 'user456', ipAddress: '192.168.1.101' },
          { id: '6', type: 'info' as const, message: 'User login successful', timestamp: '2024-01-15T10:30:00Z', details: 'Session started', source: 'auth-service', userId: 'user123', ipAddress: '192.168.1.100' },
          { id: '7', type: 'warning' as const, message: 'Storage usage at 80%', timestamp: '2024-01-15T09:30:00Z', details: 'Consider upgrading plan', source: 'monitoring', ipAddress: '10.0.0.1' },
          { id: '8', type: 'error' as const, message: 'Failed to send webhook', timestamp: '2024-01-15T08:30:00Z', details: 'Endpoint unreachable', source: 'webhook-service', ipAddress: '10.0.0.3' },
        ]
        setLogs(mockLogs)
        setStats({
          success: mockLogs.filter(l => l.type === 'success').length,
          error: mockLogs.filter(l => l.type === 'error').length,
          warning: mockLogs.filter(l => l.type === 'warning').length,
          info: mockLogs.filter(l => l.type === 'info').length,
          total: mockLogs.length
        })
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredLogs(filtered)
  }

  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/export?period=${timeFilter}&type=${typeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
      }
    } catch (error) {
      console.error('Failed to export logs:', error)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      success: 'default',
      info: 'secondary',
      warning: 'secondary',
      error: 'destructive'
    }
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hour${Math.floor(diff / 3600000) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-gray-600">Monitor all system activities and events</p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success</CardTitle>
            <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 ml-auto text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertCircle className="h-4 w-4 ml-auto text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 ml-auto text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  {getIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{log.message}</p>
                      {getTypeBadge(log.type)}
                    </div>
                    {log.details && (
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Source: {log.source}</span>
                      {log.userId && <span>User: {log.userId}</span>}
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
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
