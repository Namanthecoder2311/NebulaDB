'use client'

import { useState } from 'react'
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

export default function APIKeysPage() {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production API', key: 'ndb_prod_abc123...', created: '2024-01-10', lastUsed: '2 hours ago' },
    { id: 2, name: 'Development', key: 'ndb_dev_xyz789...', created: '2024-01-08', lastUsed: '1 day ago' },
  ])
  const [showKey, setShowKey] = useState<number | null>(null)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage your API authentication keys</p>
        </div>
        <button className="neu-button px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
          <Plus className="h-5 w-5" />
          Generate New Key
        </button>
      </div>

      <div className="neu-card p-6 bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          <strong>Security Warning:</strong> Keep your API keys secure. Never share them publicly or commit them to version control.
        </p>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your API Keys</h2>
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div key={apiKey.id} className="neu-pressed p-5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{apiKey.name}</p>
                    <p className="text-sm text-gray-600">Created: {apiKey.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    className="neu-button p-2 hover:scale-105 transition-transform"
                  >
                    {showKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button className="neu-button p-2 hover:scale-105 transition-transform">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="neu-button p-2 hover:scale-105 transition-transform text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="neu-input p-3 font-mono text-sm">
                {showKey === apiKey.id ? `ndb_prod_${Math.random().toString(36).substr(2, 32)}` : apiKey.key}
              </div>
              <p className="text-xs text-gray-500 mt-2">Last used: {apiKey.lastUsed}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
