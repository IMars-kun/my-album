'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/gallery', label: 'Album Kita' },
  { href: '/admin/login', label: 'Admin' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: '64px',
          background: scrolled || mobileOpen ? 'rgba(14,6,8,0.92)' : 'rgba(14,6,8,0.4)',
          borderBottom: scrolled || mobileOpen ? '1px solid rgba(244,63,94,0.15)' : '1px solid transparent',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          transition: 'all 0.4s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>💕</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: '#fef2f2', letterSpacing: '0.01em' }}>
              M
              <span
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #e8c97a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginLeft: 4,
                }}
              >
                Love
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: 6 }} className="sm-flex">
            <style jsx>{`
              @media (min-width: 641px) {
                .sm-flex { display: flex !important; }
                .mobile-toggle { display: none !important; }
              }
            `}</style>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '8px 18px', borderRadius: 100,
                    fontSize: 14, fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                    ...(isActive ? {
                      background: 'rgba(244,63,94,0.15)',
                      color: '#fb7185',
                      border: '1px solid rgba(244,63,94,0.3)',
                    } : {
                      color: 'rgba(255,255,255,0.65)',
                      border: '1px solid transparent',
                    }),
                  }}
                  onMouseOver={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#fef2f2'
                        ; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)'
                    }
                  }}
                  onMouseOut={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'
                        ; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'
                    }
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 8,
              color: '#fef2f2', display: 'flex', flexDirection: 'column', gap: 5
            }}
          >
            <div style={{ width: 22, height: 2, background: mobileOpen ? '#fb7185' : 'currentColor', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translateY(5px)' : 'none' }} />
            <div style={{ width: mobileOpen ? 0 : 22, height: 2, background: 'currentColor', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 22, height: 2, background: mobileOpen ? '#fb7185' : 'currentColor', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translateY(-5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(14,6,8,0.98)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            paddingTop: 64, animation: 'fadeIn 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', padding: '0 24px', maxWidth: 400 }}>
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '20px', borderRadius: 16,
                    fontSize: 18, fontWeight: 600,
                    textDecoration: 'none', textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: isActive ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#fb7185' : '#fef2f2',
                    animation: `fadeUp 0.4s ease backwards ${0.1 + i * 0.1}s`
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div style={{ marginTop: 60, opacity: 0.4, fontSize: 13, textAlign: 'center' }}>
            💕 M Love Story
          </div>
        </div>
      )}
    </>
  )
}