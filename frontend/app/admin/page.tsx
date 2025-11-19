'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Database, Activity, AlertTriangle, CheckCircle, XCircle, LogOut, Settings, BarChart3, TrendingUp, DollarSign, Zap, Server, Clock, Eye, Cpu, HardDrive, Wifi } from 'lucide-react'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalDatabases: number
  activeDatabases: number
  totalStorage: number
  usedStorage: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'suspended' | 'pending'
  lastLogin: string
  databases: number
}

interface SystemEvent {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: string
}

interface ServerStatus {
  name: string
  status: 'online' | 'offline' | 'maintenance'
  cpu: number
  memory: number
  uptime: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalDatabases: 0,
    activeDatabases: 0,
    totalStorage: 0,
    usedStorage: 0,
    systemHealth: 'healthy'
  })
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<SystemEvent[]>([])
  const [servers, setServers] = useState<ServerStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
    const interval = setInterval(fetchAdminData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('🔄 Fetching admin data at:', new Date().toLocaleTimeString())
      
      const [statsRes, usersRes, eventsRes, serversRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/events', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/servers', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        console.log('📊 Stats:', statsData)
        setStats(statsData)
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        console.log('👥 Users:', usersData.length, 'users loaded')
        setUsers(usersData)
      }
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        console.log('📝 Events:', eventsData.length, 'events loaded')
        setEvents(eventsData)
      }
      if (serversRes.ok) {
        const serversData = await serversRes.json()
        console.log('🖥️ Servers:', serversData)
        setServers(serversData)
      }
    } catch (error) {
      console.error('❌ Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <CheckCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,200,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">NebulaDB</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">Admin</span>
              </div>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-gray-300">System Administration</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Admin
              <br />
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Monitor system health, manage users, and oversee platform operations
            </p>
          </div>

          {/* System Health Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{loading ? '...' : stats.totalUsers}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{loading ? '...' : stats.activeUsers}</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{loading ? '...' : stats.totalDatabases}</div>
              <div className="text-sm text-gray-400">Total Databases</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{loading ? '...' : Math.round((stats.usedStorage / stats.totalStorage) * 100)}%</div>
              <div className="text-sm text-gray-400">Storage Used</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Quick Actions</h2>
            <p className="text-xl text-gray-400">Manage your platform efficiently</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 group hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Manage Users</h3>
              <p className="text-gray-400 mb-6">
                View, edit, and manage user accounts and permissions across the platform.
              </p>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 transition">
                Open User Management
              </button>
            </div>

            <div className="glass-card p-8 group hover:border-purple-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">System Maintenance</h3>
              <p className="text-gray-400 mb-6">
                Perform system updates, database maintenance, and server operations.
              </p>
              <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Access Maintenance
              </button>
            </div>

            <div className="glass-card p-8 group hover:border-green-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BarChart3 className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Analytics & Logs</h3>
              <p className="text-gray-400 mb-6">
                Monitor system performance, view logs, and analyze usage patterns.
              </p>
              <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                View Analytics
              </button>
            </div>
          </div>
        </section>

        {/* Real-time Monitoring */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real-time Monitoring</h2>
            <p className="text-xl text-gray-400">Live system performance and metrics</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{loading ? '...' : '+12%'}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">User Growth</h3>
              <p className="text-sm text-gray-400">vs last month</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold text-cyan-400">{loading ? '...' : '$24.5K'}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Monthly Revenue</h3>
              <p className="text-sm text-gray-400">+8% from last month</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{loading ? '...' : '1.2M'}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">API Requests</h3>
              <p className="text-sm text-gray-400">Last 24 hours</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">{loading ? '...' : '99.9%'}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Uptime</h3>
              <p className="text-sm text-gray-400">Last 30 days</p>
            </div>
          </div>
        </section>

        {/* Server Status */}
        <section className="container mx-auto px-6 py-16">
          <div className="glass-card p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Server className="mr-3 h-6 w-6 text-cyan-400" />
              Server Status
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center py-8 text-gray-400">Loading server data...</div>
              ) : servers.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-400">No server data available</div>
              ) : servers.map((server, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{server.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      server.status === 'online' ? 'bg-green-400' : 
                      server.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU:</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory:</span>
                      <span>{server.memory}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span>{server.uptime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Events & Security Alerts */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Activity className="mr-3 h-6 w-6 text-green-400" />
                Recent Events
              </h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-gray-400">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">No recent events</div>
                ) : events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'success' ? 'bg-green-400' :
                      event.type === 'warning' ? 'bg-yellow-400' :
                      event.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{event.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6 text-yellow-400" />
                Security Alerts
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="font-semibold text-red-400">High Priority</span>
                  </div>
                  <p className="text-sm text-white">Multiple failed login attempts detected</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                </div>
                
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">Medium Priority</span>
                  </div>
                  <p className="text-sm text-white">Unusual API usage pattern detected</p>
                  <p className="text-xs text-gray-400 mt-1">12 minutes ago</p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-green-400">Resolved</span>
                  </div>
                  <p className="text-sm text-white">SSL certificate renewed successfully</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="container mx-auto px-6 py-16">
          <div className="glass-card p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BarChart3 className="mr-3 h-6 w-6 text-purple-400" />
              Performance Metrics
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Cpu className="mr-2 h-4 w-4 text-blue-400" />
                  CPU Usage
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Average</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <HardDrive className="mr-2 h-4 w-4 text-green-400" />
                  Memory Usage
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Average</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Wifi className="mr-2 h-4 w-4 text-cyan-400" />
                  Network I/O
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Average</span>
                    <span>34%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Users */}
        <section className="container mx-auto px-6 py-16">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Recent Users</h3>
                <p className="text-gray-400">Latest user registrations and activity</p>
              </div>
              <div className="flex items-center gap-2">
                {getHealthIcon(stats.systemHealth)}
                <span className="text-sm text-gray-300">System {stats.systemHealth}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 font-medium text-gray-400">User</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-400">Databases</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-400">Last Login</th>
                    <th className="text-right py-4 px-4 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No users found</td></tr>
                  ) : users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-4 px-4 text-gray-300">{user.databases}</td>
                      <td className="py-4 px-4 text-sm text-gray-400">{user.lastLogin}</td>
                      <td className="py-4 px-4 text-right">
                        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-sm">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/* Storage Analytics */}
        <section className="container mx-auto px-6 py-16">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <HardDrive className="mr-3 h-6 w-6 text-orange-400" />
              Storage Breakdown
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Usage by Type</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Files</span>
                    <span className="text-sm font-medium">2.1 TB (65%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backups</span>
                    <span className="text-sm font-medium">0.8 TB (25%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Logs</span>
                    <span className="text-sm font-medium">0.3 TB (10%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Growth Trend</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">This Month</span>
                    <span className="text-sm font-medium text-green-400">+180 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Last Month</span>
                    <span className="text-sm font-medium">+165 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Average/Month</span>
                    <span className="text-sm font-medium">+172 GB</span>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-sm text-cyan-400">Projected to reach 80% capacity in 3 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}