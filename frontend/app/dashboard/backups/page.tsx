'use client'

import { useState } from 'react'
import { Database, Download, Clock, HardDrive, Plus, RefreshCw } from 'lucide-react'

export default function BackupsPage() {
  const [backups] = useState([
    { id: 1, name: 'Auto Backup', size: '245 MB', date: '2024-01-15 10:30 AM', type: 'Automatic' },
    { id: 2, name: 'Manual Backup', size: '243 MB', date: '2024-01-14 03:15 PM', type: 'Manual' },
    { id: 3, name: 'Pre-Migration', size: '240 MB', date: '2024-01-13 09:00 AM', type: 'Manual' },
  ])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Database Backups</h1>
          <p className="text-gray-600 mt-1">Manage and restore your database backups</p>
        </div>
        <button className="neu-button px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
          <Plus className="h-5 w-5" />
          Create Backup
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="neu-card p-6">
          <Database className="h-8 w-8 text-blue-600 mb-3" />
          <p className="text-gray-600 text-sm">Total Backups</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
        </div>
        <div className="neu-card p-6">
          <HardDrive className="h-8 w-8 text-purple-600 mb-3" />
          <p className="text-gray-600 text-sm">Storage Used</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">2.8 GB</p>
        </div>
        <div className="neu-card p-6">
          <Clock className="h-8 w-8 text-green-600 mb-3" />
          <p className="text-gray-600 text-sm">Last Backup</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">2h ago</p>
        </div>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Backup History</h2>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className="neu-pressed p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">{backup.name}</p>
                  <p className="text-sm text-gray-600">{backup.date} • {backup.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">{backup.type}</span>
                <button className="neu-button p-3 hover:scale-105 transition-transform">
                  <Download className="h-5 w-5" />
                </button>
                <button className="neu-button p-3 hover:scale-105 transition-transform">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
