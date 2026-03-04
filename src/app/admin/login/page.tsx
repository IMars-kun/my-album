'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import FloatingHearts from '../../../components/FloatingHearts'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(159,18,57,0.2) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '20%',
        width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(232,201,122,0.05) 0%, transparent 70%)',
      }} />

      {/* Floating decorations */}
      <FloatingHearts count={4} />

      {/* Login card */}
      <div
        className="glass animate-fade-up"
        style={{
          width: '100%', maxWidth: 440,
          borderRadius: 28, padding: '44px 40px',
          position: 'relative',
          border: '1px solid rgba(244,63,94,0.12)',
        }}
      >
        {/* Heart icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(232,201,122,0.1))',
              border: '1px solid rgba(244,63,94,0.25)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, marginBottom: 20,
            }}
          >
            🔐
          </div>
          <h1
            className="serif-font"
            style={{ fontSize: 28, fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.01em', marginBottom: 8 }}
          >
            Admin Login
          </h1>
          <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 14, marginBottom: 0, lineHeight: 1.6 }}>
            Masuk untuk mengelola album dan foto.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {error && (
            <div
              style={{
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Masuk...
              </>
            ) : (
              <>
                Masuk
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="divider" style={{ margin: '28px 0 20px' }} />

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/gallery"
            style={{ fontSize: 14, color: 'rgba(255,200,210,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fb7185')}
            onMouseOut={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,200,210,0.35)')}
          >
            ← Kembali ke Gallery
          </Link>
        </div>
      </div>

    </div>
  )
}