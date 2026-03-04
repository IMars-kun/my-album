import { createClient } from '../../../lib/serverClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAlbum } from './actions'
import AlbumActions from '../../../components/admin/AlbumActions'
import FloatingHearts from '../../../components/FloatingHearts'
import { ALLOWED_EMAILS } from '../../../lib/auth'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  if (!user.email || !ALLOWED_EMAILS.includes(user.email)) {
    redirect('/')
  }

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching albums:', error.message)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
      <FloatingHearts count={6} />

      {/* Top header */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(159,18,57,0.1), transparent)',
          borderBottom: '1px solid rgba(244,63,94,0.08)',
          padding: '32px 40px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-rose" style={{ marginBottom: 10 }}>
              <span>⚙️</span> Admin Panel
            </div>
            <h1 className="serif-font" style={{ fontSize: 32, fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
              Dashboard
            </h1>
            <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 14, marginTop: 4 }}>
              Masuk sebagai <span style={{ color: 'rgba(255,200,210,0.65)', fontWeight: 500 }}>{user.email}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="glass" style={{ padding: '16px 28px', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(244,63,94,0.1)' }}>
              <div className="gradient-text" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {albums?.length ?? 0}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,220,225,0.4)', marginTop: 2, fontWeight: 500 }}>Album</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 40px) 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 100%, 360px), 1fr))',
          gap: 32,
          alignItems: 'start'
        }}>

          {/* ── Create Album Form ── */}
          <div className="glass" style={{ borderRadius: 22, padding: '28px', position: 'sticky', top: 84, border: '1px solid rgba(244,63,94,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(232,201,122,0.1))',
                border: '1px solid rgba(244,63,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>📁</div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>Buat Album Baru</h2>
                <p style={{ fontSize: 12, color: 'rgba(255,220,225,0.4)', marginTop: 2 }}>Tambah album ke galeri kami</p>
              </div>
            </div>

            <form action={createAlbum} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 7 }}>
                  Judul Album *
                </label>
                <input
                  name="title"
                  placeholder="contoh: Liburan Bali 2024"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 7 }}>
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  placeholder="Ceritakan momen ini..."
                  rows={3}
                  className="input-field"
                  style={{ resize: 'vertical', minHeight: 90 }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Buat Album
              </button>
            </form>
          </div>

          {/* ── Albums list ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Album Kami</h2>
              <Link href="/gallery" className="btn-secondary" style={{ fontSize: 13 }}>
                Lihat Gallery ↗
              </Link>
            </div>

            {!albums || albums.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: '60px 40px', borderRadius: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>💕</div>
                <h3 className="serif-font" style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, fontStyle: 'italic' }}>Belum Ada Album</h3>
                <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 14 }}>
                  Buat album pertama menggunakan form di kiri.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {albums.map((album, i) => (
                  <div
                    key={album.id}
                    className="glass animate-fade-up"
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '16px 20px', borderRadius: 16, gap: 16,
                      animationDelay: `${i * 0.05}s`, animationFillMode: 'both',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'border-color 0.25s, background 0.25s',
                    }}
                  >
                    {/* Info — clickable link */}
                    <a
                      href={`/admin/albums/${album.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', flex: 1, minWidth: 0 }}
                    >
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: 'linear-gradient(135deg, rgba(244,63,94,0.18), rgba(232,201,122,0.12))',
                          border: '1px solid rgba(244,63,94,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, flexShrink: 0,
                        }}
                      >
                        💕
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#fef2f2', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {album.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,210,220,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {album.description || 'Tanpa deskripsi'} · {new Date(album.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </a>

                    {/* Edit / Delete */}
                    <AlbumActions album={album} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}