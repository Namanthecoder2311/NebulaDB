'use client'

import { useState } from 'react'
import { Users, Mail, Shield, UserPlus, MoreVertical } from 'lucide-react'

export default function TeamPage() {
  const [members] = useState([
    { id: 1, name: 'Devin', email: 'devin@nebuladb.com', role: 'Owner', avatar: 'D' },
    { id: 2, name: 'Rohit', email: 'rohit@nebuladb.com', role: 'Admin', avatar: 'R' },
    { id: 3, name: 'Sarah Chen', email: 'sarah@company.com', role: 'Developer', avatar: 'S' },
  ])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team and permissions</p>
        </div>
        <button className="neu-button px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
          <UserPlus className="h-5 w-5" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="neu-card p-6">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <p className="text-gray-600 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{members.length}</p>
        </div>
        <div className="neu-card p-6">
          <Shield className="h-8 w-8 text-purple-600 mb-3" />
          <p className="text-gray-600 text-sm">Admins</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">2</p>
        </div>
        <div className="neu-card p-6">
          <Mail className="h-8 w-8 text-green-600 mb-3" />
          <p className="text-gray-600 text-sm">Pending Invites</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">1</p>
        </div>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Team Members</h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="neu-pressed p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select className="neu-input px-4 py-2 text-sm" defaultValue={member.role}>
                  <option>Owner</option>
                  <option>Admin</option>
                  <option>Developer</option>
                  <option>Viewer</option>
                </select>
                <button className="neu-button p-2 hover:scale-105 transition-transform">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
