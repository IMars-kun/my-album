import { createClient } from '../../../../lib/serverClient'
import { redirect } from 'next/navigation'
import { uploadPhoto } from './actions'
import PhotoManageCard from '../../../../components/admin/PhotoManageCard'
import FloatingHearts from '../../../../components/FloatingHearts'

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: albumId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: album } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .single()

  if (!album) redirect('/admin/dashboard')

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
      <FloatingHearts count={6} />

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(159,18,57,0.1), transparent)',
          borderBottom: '1px solid rgba(244,63,94,0.08)',
          padding: '32px 40px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <a
            href="/admin/dashboard"
            className="back-link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14,
              textDecoration: 'none', marginBottom: 18, fontWeight: 500,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Dashboard
          </a>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="serif-font" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {album.title}
              </h1>
              {album.description && (
                <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 15, lineHeight: 1.6 }}>
                  {album.description}
                </p>
              )}
            </div>
            <div className="badge badge-rose">
              <span>📸</span>
              {photos?.length ?? 0} Foto
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── Upload Form ── */}
          <div className="glass" style={{ borderRadius: 22, padding: '28px', position: 'sticky', top: 84, border: '1px solid rgba(244,63,94,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(232,201,122,0.1))',
                border: '1px solid rgba(244,63,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>📤</div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>Upload Foto</h2>
                <p style={{ fontSize: 12, color: 'rgba(255,220,225,0.4)', marginTop: 2 }}>Tambah foto ke album ini</p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const file = formData.get('file') as File

                if (file) {
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
                  const originalText = submitBtn.innerHTML
                  submitBtn.disabled = true
                  submitBtn.innerHTML = '<span>⏳</span> Kompres & Upload...'

                  try {
                    const { compressImage } = await import('../../../../lib/imageCompression')
                    const compressedFile = await compressImage(file)
                    formData.set('file', compressedFile)
                    await uploadPhoto(formData)
                    form.reset()
                  } catch (err) {
                    console.error(err)
                    alert('Gagal upload foto')
                  } finally {
                    submitBtn.disabled = false
                    submitBtn.innerHTML = originalText
                  }
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <input type="hidden" name="albumId" value={albumId} />
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 8 }}>
                  Pilih Foto *
                </label>
                <div
                  style={{
                    border: '2px dashed rgba(244,63,94,0.3)',
                    borderRadius: 14, padding: '24px',
                    textAlign: 'center',
                    background: 'rgba(244,63,94,0.04)',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,220,225,0.4)', marginBottom: 10 }}>
                    PNG, JPG, WEBP
                  </p>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                    style={{ width: '100%', fontSize: 13, color: 'rgba(255,220,225,0.7)', cursor: 'pointer' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                Upload Foto
              </button>
            </form>

            <div className="divider" style={{ margin: '24px 0 20px' }} />

            <a
              href={`/gallery/${albumId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: 13, width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}
            >
              Lihat Album Publik ↗
            </a>
          </div>

          {/* ── Photos Grid ── */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 20 }}>
              Foto dalam Album
            </h2>

            {!photos || photos.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: '60px 40px', borderRadius: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📷</div>
                <h3 className="serif-font" style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, fontStyle: 'italic' }}>Belum Ada Foto</h3>
                <p style={{ color: 'rgba(255,220,225,0.4)', fontSize: 14 }}>
                  Upload foto pertama menggunakan form di kiri.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,200,210,0.3)', marginBottom: 16 }}>
                  💡 Arahkan kursor ke foto untuk melihat opsi edit / hapus.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
                    gap: 12,
                  }}
                >
                  {photos.map((photo, i) => (
                    <PhotoManageCard
                      key={photo.id}
                      photo={photo}
                      albumId={albumId}
                      index={i}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}