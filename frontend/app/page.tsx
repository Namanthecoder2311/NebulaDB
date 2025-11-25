import Link from 'next/link'
import { Database, Zap, Shield, Globe, Server, Lock, ArrowRight, Check, Sparkles } from 'lucide-react'

export default function HomePage() {
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
            <nav className="flex items-center gap-6">
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition">
                Login
              </Link>
              <Link href="/auth/register">
                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition">
                  Get Started
                </button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Serverless PostgreSQL Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Build faster with
            <br />
            <span className="gradient-text">Serverless Postgres</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Deploy databases globally in seconds. Auto-scaling, branching, and instant APIs. 
            Pay only for what you use.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <button className="group px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition flex items-center gap-2">
                Start Building Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-8 py-4 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition">
                View Docs
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-24">
            <div className="glass-card p-6">
              <div className="text-4xl font-bold gradient-text mb-2">99.99%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-4xl font-bold gradient-text mb-2">&lt;10ms</div>
              <div className="text-sm text-gray-400">Query Latency</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-4xl font-bold gradient-text mb-2">7</div>
              <div className="text-sm text-gray-400">Global Regions</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Everything you need</h2>
            <p className="text-xl text-gray-400">Production-ready from day one</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Scaling</h3>
              <p className="text-gray-400 mb-4">
                Automatically scale from zero to millions of requests. No configuration needed.
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Global Edge Network</h3>
              <p className="text-gray-400 mb-4">
                Deploy to 7 regions worldwide. Serve users from the nearest location.
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Lock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-400 mb-4">
                SOC 2 compliant with encryption at rest and in transit. Full audit logs.
              </p>
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="container mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple pricing</h2>
            <p className="text-xl text-gray-400">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="glass-card p-8 hover:border-cyan-500/50 transition">
              <div className="text-sm text-gray-400 mb-2">Free</div>
              <div className="text-5xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  500MB Storage
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  1K API calls/month
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  Community support
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Get Started
              </button>
            </div>

            <div className="glass-card p-8 border-cyan-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-sm font-medium">
                Popular
              </div>
              <div className="text-sm text-gray-400 mb-2">Pro</div>
              <div className="text-5xl font-bold mb-6">
                $29<span className="text-xl text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  10GB Storage
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  100K API calls/month
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  Priority support
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  All regions
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 transition">
                Start Pro Trial
              </button>
            </div>

            <div className="glass-card p-8 hover:border-cyan-500/50 transition">
              <div className="text-sm text-gray-400 mb-2">Enterprise</div>
              <div className="text-5xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  Unlimited storage
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  Unlimited API calls
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  24/7 support
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-cyan-400" />
                  SLA guarantee
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-32">
          <div className="glass-card p-16 text-center glow-effect">
            <h2 className="text-5xl font-bold mb-6">Ready to build?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building with NebulaDB
            </p>
            <Link href="/auth/register">
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition">
                Start Building Free
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 NebulaDB. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition">Privacy</Link>
              <Link href="/docs" className="text-gray-400 hover:text-white text-sm transition">Docs</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
