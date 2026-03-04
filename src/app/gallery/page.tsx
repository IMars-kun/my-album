import { createClient } from '../../lib/serverClient'
import Image from 'next/image'
import FloatingHearts from '../../components/FloatingHearts'

export default async function GalleryPage() {
  const supabase = await createClient()

  // 1. Fetch albums
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Fetch latest photo for each album to use as cover (if no custom cover set)
  const albumsWithCovers = albums ? await Promise.all(
    albums.map(async (album) => {
      // If cover_url is already set in DB, use it
      if (album.cover_url) {
        return album
      }

      // Otherwise fallback to latest photo
      const { data: latestPhoto } = await supabase
        .from('photos')
        .select('image_url')
        .eq('album_id', album.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...album,
        cover_url: latestPhoto?.image_url || null
      }
    })
  ) : []

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '100px 40px 80px',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingHearts count={6} />
      {/* Header */}
      <div style={{ marginBottom: 60 }} className="animate-fade-up">
        <div className="badge badge-rose" style={{ marginBottom: 18 }}>
          <span>📷</span> Album Kami
        </div>
        <h1
          className="serif-font"
          style={{
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 14,
            fontStyle: 'italic',
            color: '#fef2f2',
          }}
        >
          Koleksi{' '}
          <span className="gradient-text" style={{ fontStyle: 'normal', fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            Kenangan
          </span>
        </h1>
        <p style={{ color: 'rgba(255,220,225,0.5)', fontSize: 16, fontWeight: 400, maxWidth: 480, lineHeight: 1.7 }}>
          Setiap album menyimpan cerita dan momen indah yang tidak terlupakan bersama.
        </p>
      </div>

      <div className="divider" style={{ marginBottom: 48 }} />

      {/* Albums grid */}
      {!albumsWithCovers || albumsWithCovers.length === 0 ? (
        <div
          className="glass"
          style={{ textAlign: 'center', padding: '100px 40px', borderRadius: 24 }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>📷</div>
          <h3 className="serif-font" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, fontStyle: 'italic' }}>
            Belum Ada Album
          </h3>
          <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 15 }}>
            Album akan muncul di sini setelah dibuat oleh admin.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
          }}
        >
          {albumsWithCovers.map((album, i) => (
            <a
              key={album.id}
              href={`/gallery/${album.id}`}
              className="album-card animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
            >
              {/* Cover image */}
              <div
                style={{
                  height: 240,
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1a0a0e, #200d15)',
                }}
              >
                {album.cover_url ? (
                  <Image
                    src={album.cover_url}
                    alt={album.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="album-cover-img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(232,201,122,0.06))',
                    }}
                  >
                    <span style={{ fontSize: 56, opacity: 0.3 }}>💕</span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(14,6,8,0.75) 0%, rgba(14,6,8,0.1) 50%, transparent 100%)',
                  }}
                />
                {/* Date badge on image */}
                <div
                  style={{
                    position: 'absolute', top: 14, right: 14,
                    background: 'rgba(14,6,8,0.7)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(244,63,94,0.25)',
                    borderRadius: 100, padding: '4px 12px',
                    fontSize: 11, color: 'rgba(255,200,210,0.8)', fontWeight: 500,
                  }}
                >
                  {new Date(album.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '20px 24px 24px' }}>
                <h2
                  className="serif-font"
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    fontStyle: 'italic',
                    color: '#fef2f2',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {album.title}
                </h2>
                {album.description && (
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,220,225,0.5)',
                      lineHeight: 1.65,
                      marginBottom: 18,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {album.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, color: '#fb7185', fontWeight: 600,
                    }}
                  >
                    Buka Album
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}