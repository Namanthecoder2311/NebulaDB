'use client'

import { useState } from 'react'
import { Activity, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

export default function LogsPage() {
  const [logs] = useState([
    { id: 1, type: 'success', message: 'Database backup completed', time: '2 min ago', details: 'Backup size: 245 MB' },
    { id: 2, type: 'info', message: 'New API key generated', time: '15 min ago', details: 'Key: ndb_prod_abc...' },
    { id: 3, type: 'warning', message: 'High CPU usage detected', time: '1 hour ago', details: 'CPU: 85%' },
    { id: 4, type: 'error', message: 'Connection timeout', time: '2 hours ago', details: 'Retry attempt: 3/3' },
    { id: 5, type: 'success', message: 'Database created successfully', time: '3 hours ago', details: 'Name: production_db' },
  ])

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Monitor all system activities and events</p>
        </div>
        <div className="flex gap-3">
          <select className="neu-input px-4 py-2">
            <option>All Types</option>
            <option>Success</option>
            <option>Error</option>
            <option>Warning</option>
            <option>Info</option>
          </select>
          <select className="neu-input px-4 py-2">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="neu-card p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <p className="text-gray-600 text-sm">Success</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">156</p>
        </div>
        <div className="neu-card p-6">
          <XCircle className="h-8 w-8 text-red-600 mb-3" />
          <p className="text-gray-600 text-sm">Errors</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">3</p>
        </div>
        <div className="neu-card p-6">
          <AlertCircle className="h-8 w-8 text-yellow-600 mb-3" />
          <p className="text-gray-600 text-sm">Warnings</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
        </div>
        <div className="neu-card p-6">
          <Activity className="h-8 w-8 text-blue-600 mb-3" />
          <p className="text-gray-600 text-sm">Total Events</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">171</p>
        </div>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="neu-pressed p-4 rounded-xl flex items-start gap-4">
              {getIcon(log.type)}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{log.message}</p>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
              </div>
              <span className="text-sm text-gray-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
