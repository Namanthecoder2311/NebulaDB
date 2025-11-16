'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'

interface Record {
  id: string
  [key: string]: any
}

export default function CRUDPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/crud')
      const data = await res.json()
      setRecords(data.records || [])
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setRecords([...records, data.record])
      setShowModal(false)
      setFormData({})
    } catch (error) {
      console.error('Create error:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingRecord) return
    try {
      const res = await fetch(`/api/crud/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setRecords(records.map(r => r.id === editingRecord.id ? data.record : r))
      setShowModal(false)
      setEditingRecord(null)
      setFormData({})
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return
    try {
      await fetch(`/api/crud/${id}`, { method: 'DELETE' })
      setRecords(records.filter(r => r.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const openCreateModal = () => {
    setEditingRecord(null)
    setFormData({ name: '', email: '', status: 'active' })
    setShowModal(true)
  }

  const openEditModal = (record: Record) => {
    setEditingRecord(record)
    setFormData(record)
    setShowModal(true)
  }

  const filteredRecords = records.filter(r => 
    Object.values(r).some(v => 
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">CRUD Operations</h1>
          <p className="text-gray-600 mt-1">Create, Read, Update, Delete records</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="neu-button px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="h-5 w-5" />
          Add Record
        </button>
      </div>

      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input flex-1 px-4 py-2"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{record.name}</td>
                  <td className="py-3 px-4">{record.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-lg text-xs ${
                      record.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => openEditModal(record)}
                      className="neu-button p-2 mr-2 hover:scale-105 transition-transform"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="neu-button p-2 text-red-600 hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">No records found</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="neu-card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingRecord ? 'Edit Record' : 'Create Record'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="neu-input w-full mt-1 px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="neu-input w-full mt-1 px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="neu-input w-full mt-1 px-4 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                onClick={editingRecord ? handleUpdate : handleCreate}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
              >
                {editingRecord ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
