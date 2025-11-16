'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface BillingInfo {
  plan: string
  status: string
  current_period: {
    start: string
    end: string
  }
  usage: {
    queries: number
    api_calls: number
    compute_hours: number
    storage_gb: number
    estimated_cost: number
  }
  next_invoice: {
    amount: number
    due_date: string
    status: string
  }
  payment_method?: {
    type: string
    last4: string
    brand: string
  }
}

interface BillingDashboardProps {
  projectId: string
}

export default function BillingDashboard({ projectId }: BillingDashboardProps) {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      fetchBillingInfo()
      fetchInvoices()
    }
  }, [projectId])

  const fetchBillingInfo = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/usage/billing`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.ok) {
        const data = await response.json()
        setBilling(data)
        setSelectedPlan(data.plan)
      }
    } catch (error) {
      console.error('Failed to fetch billing info:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/billing/invoices`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    }
  }

  const updateSubscription = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/billing/subscription`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ plan: selectedPlan })
        }
      )

      if (response.ok) {
        fetchBillingInfo()
      }
    } catch (error) {
      console.error('Failed to update subscription:', error)
    }
  }

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'free': return '$0'
      case 'pro': return '$29'
      case 'enterprise': return '$99'
      default: return '$0'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading billing info...</div>
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg capitalize">{billing?.plan} Plan</h3>
              <p className="text-2xl font-bold">{getPlanPrice(billing?.plan || 'free')}/month</p>
              <Badge variant={billing?.status === 'active' ? 'default' : 'secondary'}>
                {billing?.status}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Billing Period</h4>
              <p className="text-sm text-gray-600">
                {billing?.current_period.start && new Date(billing.current_period.start).toLocaleDateString()} - {' '}
                {billing?.current_period.end && new Date(billing.current_period.end).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              {billing?.payment_method ? (
                <p className="text-sm">
                  {billing.payment_method.brand.toUpperCase()} •••• {billing.payment_method.last4}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No payment method</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Costs */}
      {billing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">SQL Queries</span>
                  <span className="font-medium">{billing.usage.queries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Calls</span>
                  <span className="font-medium">{billing.usage.api_calls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Compute Hours</span>
                  <span className="font-medium">{billing.usage.compute_hours.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage</span>
                  <span className="font-medium">{billing.usage.storage_gb.toFixed(1)} GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Estimated Amount</span>
                  <span className="text-2xl font-bold">${billing.usage.estimated_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Due Date</span>
                  <span className="font-medium">
                    {new Date(billing.next_invoice.due_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <Badge variant="secondary">{billing.next_invoice.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Free</h3>
                <p className="text-2xl font-bold">$0</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• 1,000 queries/month</li>
                  <li>• 500 API calls/month</li>
                  <li>• 1GB storage</li>
                </ul>
              </div>
              
              <div className="border-2 border-blue-500 rounded-lg p-4">
                <h3 className="font-medium">Pro</h3>
                <p className="text-2xl font-bold">$29</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Unlimited queries</li>
                  <li>• 100,000 API calls/month</li>
                  <li>• 10GB storage</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Enterprise</h3>
                <p className="text-2xl font-bold">$99</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Everything in Pro</li>
                  <li>• Unlimited storage</li>
                  <li>• SLA guarantees</li>
                  <li>• Custom integrations</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={updateSubscription}
                disabled={selectedPlan === billing?.plan}
              >
                Update Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center">
                  {getStatusIcon(invoice.status)}
                  <div className="ml-3">
                    <p className="font-medium">{invoice.period}</p>
                    <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">${invoice.amount}</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}