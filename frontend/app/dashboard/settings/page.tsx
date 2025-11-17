'use client'

import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Globe } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    backup: true,
    billing: true,
    security: false,
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="neu-card p-6">
          <User className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Profile</h3>
          <p className="text-sm text-gray-600 mb-4">Update your personal information</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input type="text" defaultValue="Devin" className="neu-input w-full mt-1 px-4 py-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input type="email" defaultValue="devin@nebuladb.com" className="neu-input w-full mt-1 px-4 py-2" />
            </div>
            <button className="neu-button px-4 py-2 w-full hover:scale-105 transition-transform">
              Save Changes
            </button>
          </div>
        </div>

        <div className="neu-card p-6">
          <Bell className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Notifications</h3>
          <p className="text-sm text-gray-600 mb-4">Configure your notification preferences</p>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 capitalize">{key} Alerts</span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => setNotifications({...notifications, [key]: checked})}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="neu-card p-6">
          <Shield className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Security</h3>
          <p className="text-sm text-gray-600 mb-4">Manage your security settings</p>
          <div className="space-y-3">
            <button className="neu-button px-4 py-2 w-full hover:scale-105 transition-transform text-left">
              Change Password
            </button>
            <button className="neu-button px-4 py-2 w-full hover:scale-105 transition-transform text-left">
              Enable 2FA
            </button>
            <button className="neu-button px-4 py-2 w-full hover:scale-105 transition-transform text-left">
              Active Sessions
            </button>
          </div>
        </div>
      </div>

      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="font-bold text-gray-800">Regional Settings</h3>
            <p className="text-sm text-gray-600">Configure timezone and language</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Timezone</label>
            <select className="neu-input w-full mt-1 px-4 py-2">
              <option>UTC (GMT+0)</option>
              <option>EST (GMT-5)</option>
              <option>PST (GMT-8)</option>
              <option>IST (GMT+5:30)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Language</label>
            <select className="neu-input w-full mt-1 px-4 py-2">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="neu-card p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-800 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">Irreversible actions</p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}
