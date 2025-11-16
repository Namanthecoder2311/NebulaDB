import Link from 'next/link'
import { Database, Zap, Shield, BarChart3, Globe, Server, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="px-6 lg:px-8 h-20 flex items-center neu-card mx-4 mt-4">
        <Link className="flex items-center justify-center" href="/">
          <div className="neu-pressed p-3 rounded-xl">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-2xl ml-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NebulaDB
          </span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth/login">
            Login
          </Link>
          <Link href="/auth/register">
            <button className="neu-button px-6 py-2 text-sm font-medium text-primary">
              Sign Up
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="neu-card p-4 rounded-2xl">
                <Globe className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                  Serverless PostgreSQL
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Across Global Datacenters
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 text-lg md:text-xl">
                  Deploy databases in 7 global regions. Auto-generated APIs, real-time monitoring, 
                  and pay only for what you use.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/auth/register">
                  <button className="neu-button px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/docs">
                  <button className="neu-button px-8 py-4 text-lg font-semibold">
                    View Documentation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-transparent">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="neu-card p-8 hover:scale-105 transition-transform">
                <div className="neu-pressed p-4 rounded-xl w-fit mb-4">
                  <Server className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Global Datacenters</h3>
                <p className="text-gray-600">
                  Deploy in US, EU, or Asia Pacific regions. Choose the datacenter closest to your users for optimal performance.
                </p>
                <div className="mt-4 text-sm text-primary font-medium">
                  Starting at $0.08/GB
                </div>
              </div>
              
              <div className="neu-card p-8 hover:scale-105 transition-transform">
                <div className="neu-pressed p-4 rounded-xl w-fit mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Serverless Compute</h3>
                <p className="text-gray-600">
                  Automatic scaling with ephemeral PostgreSQL instances. Pay per second of compute time used.
                </p>
                <div className="mt-4 text-sm text-primary font-medium">
                  $0.04/hour compute
                </div>
              </div>
              
              <div className="neu-card p-8 hover:scale-105 transition-transform">
                <div className="neu-pressed p-4 rounded-xl w-fit mb-4">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-gray-600">
                  End-to-end encryption, row-level security, and comprehensive audit logging across all datacenters.
                </p>
                <div className="mt-4 text-sm text-primary font-medium">
                  SOC 2 Compliant
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Datacenter Map */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">7 Global Datacenters</h2>
              <p className="text-gray-600 text-lg">Deploy closer to your users for better performance</p>
            </div>
            
            <div className="neu-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { region: 'US East', city: 'Virginia', latency: '45ms', price: '$0.10/GB' },
                  { region: 'US West', city: 'California', latency: '60ms', price: '$0.12/GB' },
                  { region: 'EU Central', city: 'Frankfurt', latency: '85ms', price: '$0.11/GB' },
                  { region: 'EU West', city: 'London', latency: '90ms', price: '$0.11/GB' },
                  { region: 'Asia Pacific', city: 'Mumbai', latency: '120ms', price: '$0.08/GB' },
                  { region: 'Asia Pacific', city: 'Singapore', latency: '140ms', price: '$0.09/GB' },
                  { region: 'Asia Pacific', city: 'Tokyo', latency: '150ms', price: '$0.13/GB' },
                ].map((dc, i) => (
                  <div key={i} className="neu-pressed p-6 rounded-xl hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <Globe className="h-6 w-6 text-primary" />
                      <span className="text-xs font-medium text-green-600">{dc.latency}</span>
                    </div>
                    <h4 className="font-bold text-lg">{dc.region}</h4>
                    <p className="text-sm text-gray-600">{dc.city}</p>
                    <div className="mt-3 text-sm font-medium text-primary">{dc.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-20 bg-transparent">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-600 text-lg">Pay only for what you use. No hidden fees.</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              <div className="neu-card p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <div className="text-5xl font-bold mb-6">$0</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    1 Project
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    500MB Storage
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    1,000 API calls/month
                  </li>
                </ul>
                <button className="neu-button w-full py-3 font-medium">
                  Get Started
                </button>
              </div>
              
              <div className="neu-card p-8 border-2 border-primary relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">For growing applications</p>
                <div className="text-5xl font-bold mb-6">
                  $29<span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    10GB storage included
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    100,000 API calls/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    All datacenters
                  </li>
                </ul>
                <button className="w-full py-3 font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  Start Pro Trial
                </button>
              </div>
              
              <div className="neu-card p-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large-scale applications</p>
                <div className="text-5xl font-bold mb-6">Custom</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Custom limits
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Dedicated support
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    SLA guarantees
                  </li>
                  <li className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Private datacenters
                  </li>
                </ul>
                <button className="neu-button w-full py-3 font-medium">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="neu-card mx-4 mb-4 p-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 NebulaDB. All rights reserved.
          </p>
          <nav className="flex gap-6 mt-4 sm:mt-0">
            <Link className="text-sm hover:text-primary transition-colors" href="/terms">
              Terms
            </Link>
            <Link className="text-sm hover:text-primary transition-colors" href="/privacy">
              Privacy
            </Link>
            <Link className="text-sm hover:text-primary transition-colors" href="/docs">
              Docs
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}