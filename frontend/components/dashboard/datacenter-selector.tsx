'use client'

import { useState, useEffect } from 'react'
import { Globe, Zap, DollarSign, Activity, Check } from 'lucide-react'

interface Datacenter {
  id: string
  name: string
  region: string
  country: string
  city: string
  latency_ms: number
  price_per_gb: number
  price_per_hour: number
  available: boolean
  tier: string
}

interface DatacenterSelectorProps {
  databaseId?: string
  onSelect?: (datacenterId: string) => void
}

export default function DatacenterSelector({ databaseId, onSelect }: DatacenterSelectorProps) {
  const [datacenters, setDatacenters] = useState<Datacenter[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDatacenters()
  }, [])

  const fetchDatacenters = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/datacenters`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDatacenters(data)
      }
    } catch (error) {
      console.error('Failed to fetch datacenters:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectDatacenter = async (datacenterId: string) => {
    if (!databaseId) {
      setSelected(datacenterId)
      onSelect?.(datacenterId)
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/databases/${databaseId}/datacenter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ datacenter_id: datacenterId })
        }
      )

      if (response.ok) {
        setSelected(datacenterId)
        onSelect?.(datacenterId)
      }
    } catch (error) {
      console.error('Failed to select datacenter:', error)
    }
  }

  const getTierColor = (tier: string) => {
    return tier === 'premium' ? 'text-purple-600' : 'text-blue-600'
  }

  const getTierBadge = (tier: string) => {
    return tier === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading datacenters...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Datacenter</h2>
        <p className="text-gray-600">Select the region closest to your users for optimal performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datacenters.map((dc) => (
          <div
            key={dc.id}
            onClick={() => selectDatacenter(dc.id)}
            className={`neu-card p-6 cursor-pointer transition-all hover:scale-105 ${
              selected === dc.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            {selected === dc.id && (
              <div className="flex justify-end mb-2">
                <div className="neu-pressed p-2 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="neu-pressed p-3 rounded-xl">
                <Globe className={`h-6 w-6 ${getTierColor(dc.tier)}`} />
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getTierBadge(dc.tier)}`}>
                {dc.tier}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-1">{dc.region}</h3>
            <p className="text-sm text-gray-600 mb-4">{dc.city}, {dc.country}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between neu-pressed p-3 rounded-lg">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">Latency</span>
                </div>
                <span className="text-sm font-medium">{dc.latency_ms}ms</span>
              </div>

              <div className="flex items-center justify-between neu-pressed p-3 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Storage</span>
                </div>
                <span className="text-sm font-medium">${dc.price_per_gb}/GB</span>
              </div>

              <div className="flex items-center justify-between neu-pressed p-3 rounded-lg">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="text-sm">Compute</span>
                </div>
                <span className="text-sm font-medium">${dc.price_per_hour}/hr</span>
              </div>
            </div>

            {!dc.available && (
              <div className="mt-4 text-center text-sm text-red-600 font-medium">
                Coming Soon
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="neu-card p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Selected Datacenter</h3>
          <p className="text-gray-600">
            {datacenters.find(dc => dc.id === selected)?.name}
          </p>
        </div>
      )}
    </div>
  )
}