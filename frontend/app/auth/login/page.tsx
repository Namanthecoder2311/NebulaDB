"use client"

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', color: 'white' }}>
        <header style={{ textAlign: 'center', padding: '40px 0' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: 8, textShadow: '2px 2px 4px rgba(0,0,0,.3)' }}>NebulaDB</h1>
          <p style={{ opacity: 0.95, fontSize: '1.1rem' }}>Manage serverless Postgres projects and databases</p>
        </header>

        <section style={{ display: 'grid', gap: 20, margin: '32px 0', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ background: '#fff', color: '#222', padding: 24, borderRadius: 12 }}>
              <h3 style={{ color: '#667eea', marginBottom: 8 }}>Fast Databases</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li>Low-latency connections</li>
                <li>Serverless scaling</li>
                <li>Easy branching and previews</li>
              </ul>
            </div>

            <div style={{ background: '#fff', color: '#222', padding: 24, borderRadius: 12 }}>
              <h3 style={{ color: '#667eea', marginBottom: 8 }}>Built for Developers</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li>Integrated SQL editor</li>
                <li>API keys & webhooks</li>
                <li>Audit logs & backups</li>
              </ul>
            </div>

            <div style={{ background: '#fff', color: '#222', padding: 24, borderRadius: 12 }}>
              <h3 style={{ color: '#667eea', marginBottom: 8 }}>Transparent Pricing</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li>Free tier to get started</li>
                <li>Pay-as-you-grow</li>
                <li>Enterprise plans available</li>
              </ul>
            </div>
          </section>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '10px 20px', background: '#fff', color: '#667eea', borderRadius: 8, fontWeight: 600 }}>Open Dashboard</a>
          </div>
        </div>
      </div>
    )
  }