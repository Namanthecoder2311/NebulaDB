'use client'

import { useState } from 'react'
import { CreditCard, Lock, Check, Shield, Zap, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import BillingDashboard from '@/components/dashboard/billing-dashboard'
import { CreditCard } from 'lucide-react'


export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)

  const plans = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 29, yearly: 290 },
    enterprise: { monthly: 99, yearly: 990 }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      alert('Payment successful! Subscription activated.')
    }, 2000)
  }

  const getPrice = () => {
    const plan = plans[selectedPlan as keyof typeof plans]
    return billingCycle === 'monthly' ? plan.monthly : plan.yearly
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">Select a plan and complete your payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Toggle */}
            <div className="neu-card p-6">
              <div className="flex items-center justify-center gap-4">
                <span className={`font-medium ${billingCycle === 'monthly' ? 'text-primary' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="neu-button px-1 py-1 rounded-full w-16 relative"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>
                <span className={`font-medium ${billingCycle === 'yearly' ? 'text-primary' : 'text-gray-500'}`}>
                  Yearly
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Save 17%</span>
                </span>
              </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div
                onClick={() => setSelectedPlan('free')}
                className={`neu-card p-6 cursor-pointer transition-all hover:scale-105 ${
                  selectedPlan === 'free' ? 'ring-2 ring-primary' : ''
                }`}
              >
                {selectedPlan === 'free' && (
                  <div className="flex justify-end mb-2">
                    <div className="neu-pressed p-2 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0</div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    1 Project
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    500MB Storage
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    1K API calls/mo
                  </li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => setSelectedPlan('pro')}
                className={`neu-card p-6 cursor-pointer transition-all hover:scale-105 relative ${
                  selectedPlan === 'pro' ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                  Popular
                </div>
                {selectedPlan === 'pro' && (
                  <div className="flex justify-end mb-2">
                    <div className="neu-pressed p-2 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  ${billingCycle === 'monthly' ? '29' : '24'}
                  <span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Unlimited Projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    10GB Storage
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    100K API calls/mo
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    All Datacenters
                  </li>
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div
                onClick={() => setSelectedPlan('enterprise')}
                className={`neu-card p-6 cursor-pointer transition-all hover:scale-105 ${
                  selectedPlan === 'enterprise' ? 'ring-2 ring-primary' : ''
                }`}
              >
                {selectedPlan === 'enterprise' && (
                  <div className="flex justify-end mb-2">
                    <div className="neu-pressed p-2 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-4">
                  ${billingCycle === 'monthly' ? '99' : '82'}
                  <span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Unlimited Storage
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    SLA Guarantees
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Priority Support
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            {selectedPlan !== 'free' && (
              <div className="neu-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <CreditCard className="mr-3 h-6 w-6 text-primary" />
                  Payment Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                        className="neu-input w-full px-4 py-3 text-gray-700 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                        <img src="/visa.svg" alt="Visa" className="h-6" />
                        <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name on Card</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="neu-input w-full px-4 py-3 text-gray-700 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        required
                        className="neu-input w-full px-4 py-3 text-gray-700 focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">CVC</label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        required
                        className="neu-input w-full px-4 py-3 text-gray-700 focus:outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="neu-pressed p-4 rounded-xl flex items-start">
                    <Lock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-700 mb-1">Secure Payment</p>
                      <p>Your payment information is encrypted and secure. We never store your card details.</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : `Pay $${getPrice()} ${billingCycle === 'yearly' ? '/year' : '/month'}`}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="neu-card p-6 sticky top-6 space-y-6">
              <h3 className="text-xl font-bold">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium capitalize">{billingCycle}</span>
                </div>
                {billingCycle === 'yearly' && selectedPlan !== 'free' && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-17%</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${getPrice()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                  </p>
                </div>
              </div>

              <div className="neu-pressed p-4 rounded-xl space-y-3">
                <p className="font-medium text-sm">Includes:</p>
                {selectedPlan === 'pro' && (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <Zap className="h-4 w-4 mr-2 text-purple-600" />
                      Serverless compute
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2 text-blue-600" />
                      Global datacenters
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-600" />
                      Enterprise security
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Cancel anytime. No hidden fees.</p>
                <p className="mt-1">30-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}