'use client'

import { useState } from 'react'
import { Upload, Download, FileJson, FileText, Database } from 'lucide-react'

export default function ImportExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('json')

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Import / Export Data</h1>
        <p className="text-gray-600 mt-1">Transfer data between databases and files</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="neu-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Import Data</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Select Database</label>
              <select className="neu-input w-full mt-1 px-4 py-2">
                <option>production_db</option>
                <option>staging_db</option>
                <option>development_db</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">File Format</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['json', 'csv', 'sql'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`neu-button p-3 text-sm uppercase ${selectedFormat === format ? 'bg-blue-100' : ''}`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="neu-pressed p-8 rounded-xl border-2 border-dashed border-gray-300 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Drop file here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">Max file size: 100MB</p>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all">
              Import Data
            </button>
          </div>
        </div>

        <div className="neu-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Export Data</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Select Database</label>
              <select className="neu-input w-full mt-1 px-4 py-2">
                <option>production_db</option>
                <option>staging_db</option>
                <option>development_db</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Select Table (Optional)</label>
              <select className="neu-input w-full mt-1 px-4 py-2">
                <option>All Tables</option>
                <option>users</option>
                <option>products</option>
                <option>orders</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Export Format</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button className="neu-button p-3 flex flex-col items-center gap-1">
                  <FileJson className="h-6 w-6" />
                  <span className="text-xs">JSON</span>
                </button>
                <button className="neu-button p-3 flex flex-col items-center gap-1">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">CSV</span>
                </button>
                <button className="neu-button p-3 flex flex-col items-center gap-1">
                  <Database className="h-6 w-6" />
                  <span className="text-xs">SQL</span>
                </button>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all">
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="neu-card p-6">
        <h3 className="font-bold text-gray-800 mb-3">Recent Exports</h3>
        <div className="space-y-2">
          {[
            { name: 'production_db_backup.json', size: '45 MB', date: '2 hours ago' },
            { name: 'users_table.csv', size: '2.3 MB', date: '1 day ago' },
            { name: 'full_database.sql', size: '120 MB', date: '3 days ago' },
          ].map((file, i) => (
            <div key={i} className="neu-pressed p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileJson className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-600">{file.size} • {file.date}</p>
                </div>
              </div>
              <button className="neu-button p-2">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
