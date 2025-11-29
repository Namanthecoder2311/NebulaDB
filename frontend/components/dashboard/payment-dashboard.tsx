'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

interface PaymentDashboardProps {
  projectId?: string
}

export default function PaymentDashboard({ projectId }: PaymentDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Manage payment methods and invoices for this project{projectId ? ` (${projectId})` : ''}.</p>
        <div className="mt-4">
          <Button variant="outline">Add Payment Method</Button>
        </div>
      </CardContent>
    </Card>
  )
}
