'use client'

import { uploadPhoto } from '../../app/admin/albums/[id]/actions'
import { compressImage } from '../../lib/imageCompression'

interface Props {
    albumId: string
}

export function UploadPhotoForm({ albumId }: Props) {
    return (
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
    )
}
