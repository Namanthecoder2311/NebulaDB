'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, BarChart } from 'lucide-react'

interface ExportAnalyticsProps {
  projectId: string
}

export default function ExportAnalytics({ projectId }: ExportAnalyticsProps) {
  const [format, setFormat] = useState('json')
  const [period, setPeriod] = useState('7d')
  const [exporting, setExporting] = useState(false)

  const exportData = async () => {
    setExporting(true)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/usage?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (format === 'json') {
          downloadJSON(data)
        } else if (format === 'csv') {
          downloadCSV(data)
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const downloadJSON = (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadFile(blob, `analytics-${period}.json`)
  }

  const downloadCSV = (data: any) => {
    const csv = [
      'Metric,Value',
      `Queries,${data.queries}`,
      `API Calls,${data.api_calls}`,
      `Compute Time,${data.compute_time}`,
      `Storage Used,${data.storage_used}`,
      `Error Rate,${data.error_rate}`,
      `Avg Query Time,${data.avg_query_time}`
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadFile(blob, `analytics-${period}.csv`)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Export Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={exportData} disabled={exporting} className="w-full">
            {format === 'json' ? <FileText className="mr-2 h-4 w-4" /> : <BarChart className="mr-2 h-4 w-4" />}
            {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}