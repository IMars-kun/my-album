import FloatingHearts from '../components/FloatingHearts'
import Link from 'next/link'

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(159,18,57,0.18) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: 500, height: 500,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(232,201,122,0.06) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '-5%', width: 400, height: 400,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)',
      }} />

      {/* Floating emojis */}
      <FloatingHearts count={8} />

      {/* Badge */}
      <div
        className="animate-fade-up badge badge-rose"
        style={{ marginBottom: 30, fontFamily: "'Inter', sans-serif" }}
      >
        <span className="animate-heartbeat" style={{ display: 'inline-block' }}>❤️</span>
        Our Love Story
      </div>

      {/* Main headline */}
      <h1
        className="animate-fade-up delay-100 serif-font"
        style={{
          fontSize: 'clamp(48px, 9vw, 100px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          maxWidth: 820,
          marginBottom: 12,
          fontStyle: 'italic',
          color: '#fef2f2',
        }}
      >
        Setiap Momen
      </h1>
      <h2
        className="animate-fade-up delay-200"
        style={{
          fontSize: 'clamp(36px, 7vw, 80px)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          maxWidth: 820,
          marginBottom: 32,
        }}
      >
        <span className="gradient-text">Bersama Kamu.</span>
      </h2>

      {/* Subtext */}
      <p
        className="animate-fade-up delay-300"
        style={{
          fontSize: 17,
          color: 'rgba(255, 220, 225, 0.55)',
          maxWidth: 480,
          textAlign: 'center',
          lineHeight: 1.75,
          marginBottom: 52,
          fontWeight: 400,
        }}
      >
        Album kenangan pribadi kami — dipenuhi foto-foto indah dari setiap perjalanan cinta kita bersama.
      </p>

      {/* CTAs */}
      <div
        className="animate-fade-up delay-400"
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
      >
        <Link href="/gallery" className="btn-primary animate-pulse-glow" style={{ gap: 10 }}>
          <span>💕</span>
          <span>Lihat Album Kita</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href="/admin/login" className="btn-secondary">
          <span>🔐</span>
          Admin
        </Link>
      </div>

      {/* Stats row */}
      <div
        className="animate-fade-up delay-500"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          maxWidth: 600, width: '100%',
          gap: 0,
          border: '1px solid rgba(244,63,94,0.1)',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.02)',
          overflow: 'hidden'
        }}
      >
        {[
          { value: '∞', label: 'Kenangan Tersimpan', icon: '📸' },
          { value: '1', label: 'Cinta Selamanya', icon: '💕' },
          { value: '100%', label: 'Privat & Aman', icon: '🔒' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              borderRight: i < 2 ? '1px solid rgba(244,63,94,0.1)' : 'none',
              background: 'linear-gradient(to bottom, transparent, rgba(244,63,94,0.02))'
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
            <div
              style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}
              className="gradient-text"
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,220,225,0.45)', marginTop: 4, fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-float"
        style={{
          position: 'absolute', bottom: 32, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6, opacity: 0.35,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,150,170,0.7)' }}>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="rgba(244,63,94,0.7)" strokeWidth="1.5">
          <rect x="1" y="1" width="12" height="18" rx="6" />
          <line x1="7" y1="5" x2="7" y2="9" strokeLinecap="round" />
        </svg>
      </div>

    </div>
  )
}