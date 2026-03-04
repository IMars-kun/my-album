import { createClient } from '../../../lib/serverClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GalleryLightbox from '../../../components/GalleryLightbox'
import FloatingHearts from '../../../components/FloatingHearts'

export default async function GalleryDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: albumId } = await params
  const supabase = await createClient()

  const { data: album } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .single()

  if (!album) redirect('/gallery')

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
      <FloatingHearts count={6} />

      {/* Hero band */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(159,18,57,0.12), transparent)',
          borderBottom: '1px solid rgba(244,63,94,0.1)',
          padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 40px) 36px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Back link */}
          <Link
            href="/gallery"
            className="back-link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14,
              textDecoration: 'none', marginBottom: 24,
              fontWeight: 500,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Gallery
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1
                className="serif-font"
                style={{
                  fontSize: 'clamp(24px, 5vw, 52px)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  marginBottom: 10,
                  color: '#fef2f2',
                }}
              >
                {album.title}
              </h1>
              {album.description && (
                <p style={{ color: 'rgba(255,220,225,0.5)', fontSize: 'clamp(14px, 4vw, 16px)', maxWidth: 600, lineHeight: 1.7 }}>
                  {album.description}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, paddingTop: 8 }}>
              <div className="badge badge-rose">
                <span>📸</span>
                {photos?.length ?? 0} Foto
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px, 6vw, 48px) clamp(20px, 5vw, 40px) 80px' }}>
        {!photos || photos.length === 0 ? (
          <div
            className="glass"
            style={{ textAlign: 'center', padding: '100px 40px', borderRadius: 24, marginTop: 24 }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🖼️</div>
            <h3 className="serif-font" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, fontStyle: 'italic' }}>
              Belum Ada Foto
            </h3>
            <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 15 }}>
              Foto akan muncul di sini setelah diupload ke album ini.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'rgba(255,200,210,0.35)', marginBottom: 24 }}>
              💡 Klik foto untuk melihat ukuran penuh
            </p>
            <GalleryLightbox photos={photos} />
          </>
        )}
      </div>
    </div>
  )
}