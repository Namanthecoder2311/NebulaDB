'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, Mail, Shield, UserPlus, MoreVertical, Trash2, Edit } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Developer' | 'Viewer'
  status: 'active' | 'pending' | 'suspended'
  joinedAt: string
  lastActive?: string
}

interface PendingInvite {
  id: string
  email: string
  role: string
  invitedAt: string
  invitedBy: string
}

const ROLES = [
  { value: 'Owner', label: 'Owner', description: 'Full access to everything' },
  { value: 'Admin', label: 'Admin', description: 'Manage team and databases' },
  { value: 'Developer', label: 'Developer', description: 'Create and manage databases' },
  { value: 'Viewer', label: 'Viewer', description: 'Read-only access' },
]

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [newInvite, setNewInvite] = useState({ email: '', role: 'Developer' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const [membersRes, invitesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/members`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/invites`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      if (membersRes.ok && invitesRes.ok) {
        const [membersData, invitesData] = await Promise.all([
          membersRes.json(),
          invitesRes.json()
        ])
        setMembers(membersData)
        setPendingInvites(invitesData)
      } else {
        // Mock data
        setMembers([
          { id: '1', name: 'Devin', email: 'devin@nebuladb.com', role: 'Owner', status: 'active', joinedAt: '2024-01-01T00:00:00Z', lastActive: '2024-01-15T10:30:00Z' },
          { id: '2', name: 'Rohit', email: 'rohit@nebuladb.com', role: 'Admin', status: 'active', joinedAt: '2024-01-02T00:00:00Z', lastActive: '2024-01-15T09:15:00Z' },
          { id: '3', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Developer', status: 'active', joinedAt: '2024-01-10T00:00:00Z', lastActive: '2024-01-14T16:45:00Z' },
        ])
        setPendingInvites([
          { id: '1', email: 'john@company.com', role: 'Developer', invitedAt: '2024-01-14T10:00:00Z', invitedBy: 'Devin' }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newInvite.email || !newInvite.role) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newInvite)
      })

      if (response.ok) {
        const invite = await response.json()
        setPendingInvites([invite, ...pendingInvites])
      } else {
        // Mock invite
        const mockInvite = {
          id: Date.now().toString(),
          email: newInvite.email,
          role: newInvite.role,
          invitedAt: new Date().toISOString(),
          invitedBy: 'You'
        }
        setPendingInvites([mockInvite, ...pendingInvites])
      }
      
      setNewInvite({ email: '', role: 'Developer' })
      setInviteOpen(false)
    } catch (error) {
      console.error('Failed to send invite:', error)
    }
  }

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      
      setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole as any } : m))
    } catch (error) {
      console.error('Failed to update member role:', error)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return
    
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMembers(members.filter(m => m.id !== memberId))
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const cancelInvite = async (inviteId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/invites/${inviteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setPendingInvites(pendingInvites.filter(i => i.id !== inviteId))
    } catch (error) {
      console.error('Failed to cancel invite:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      Owner: 'default',
      Admin: 'default',
      Developer: 'secondary',
      Viewer: 'secondary'
    }
    return <Badge variant={variants[role] || 'secondary'}>{role}</Badge>
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-gray-600">Manage your team and permissions</p>
        </div>
        
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your NebulaDB team
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={sendInvite} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newInvite.role} onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.filter(r => r.value !== 'Owner').map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send Invite
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 ml-auto text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 ml-auto text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter(m => ['Owner', 'Admin'].includes(m.role)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 ml-auto text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvites.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                      {member.lastActive && (
                        <span> • Last active {new Date(member.lastActive).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role !== 'Owner' && (
                    <>
                      <Select 
                        value={member.role} 
                        onValueChange={(value) => updateMemberRole(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.filter(r => r.value !== 'Owner').map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => removeMember(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-gray-500">
                      Invited as {invite.role} by {invite.invitedBy} on {new Date(invite.invitedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => cancelInvite(invite.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
