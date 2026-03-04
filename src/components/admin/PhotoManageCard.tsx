'use client'

import Image from 'next/image'
import { useState, useTransition, useRef } from 'react'
import { deletePhoto, updatePhoto } from '../../app/admin/albums/[id]/actions'
import { setAlbumCover } from '../../app/admin/dashboard/actions'

interface Photo {
    id: string
    image_url: string
}

interface Props {
    photo: Photo
    albumId: string
    index: number
}

export default function PhotoManageCard({ photo, albumId, index }: Props) {
    const [isHovered, setIsHovered] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.set('photoId', photo.id)
        formData.set('albumId', albumId)
        formData.set('imageUrl', photo.image_url)
        startTransition(() => {
            deletePhoto(formData)
        })
        setShowDeleteModal(false)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)
        formData.set('photoId', photo.id)
        formData.set('albumId', albumId)
        formData.set('oldImageUrl', photo.image_url)
        startTransition(() => {
            updatePhoto(formData)
        })
        setShowEditModal(false)
        setPreview(null)
    }

    return (
        <>
            {/* Photo Card */}
            <div
                className="photo-manage-card"
                style={{
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    animationDelay: `${index * 0.04}s`,
                    animationFillMode: 'both',
                    opacity: isPending ? 0.4 : 1,
                    transition: 'opacity 0.3s',
                    height: 160,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    src={photo.image_url}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s cubic-bezier(.4,0,.2,1)',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    }}
                />

                {/* Hover overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '12px',
                        gap: '8px',
                    }}
                >
                    {/* Set as Cover button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            startTransition(() => {
                                setAlbumCover(albumId, photo.image_url)
                            })
                        }}
                        title="Jadikan Sampul Album"
                        style={{
                            flex: '0 0 40px',
                            height: 38,
                            padding: 0,
                            borderRadius: 8,
                            border: '1px solid rgba(232,201,122,0.5)',
                            background: 'rgba(232,201,122,0.2)',
                            color: '#e8c97a',
                            cursor: isPending ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(232,201,122,0.35)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(232,201,122,0.2)')}
                        disabled={isPending}
                    >
                        ⭐
                    </button>

                    {/* Edit button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowEditModal(true) }}
                        title="Ganti foto"
                        style={{
                            flex: 1,
                            padding: '8px 0',
                            borderRadius: 8,
                            border: '1px solid rgba(251,191,36,0.5)',
                            background: 'rgba(251,191,36,0.2)',
                            color: '#fbbf24',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            backdropFilter: 'blur(4px)',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(251,191,35,0.35)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(251,191,35,0.2)')}
                    >
                        ✏️
                    </button>

                    {/* Delete button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true) }}
                        title="Hapus foto"
                        style={{
                            flex: 1,
                            padding: '8px 0',
                            borderRadius: 8,
                            border: '1px solid rgba(239,68,68,0.5)',
                            background: 'rgba(239,68,68,0.2)',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            backdropFilter: 'blur(4px)',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.35)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                    >
                        🗑️
                    </button>
                </div>

                {/* Loading overlay */}
                {isPending && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.5)',
                    }}>
                        <div style={{ fontSize: 24 }}>⏳</div>
                    </div>
                )}
            </div>

            {/* ── Delete Modal ── */}
            {showDeleteModal && (
                <div
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 300,
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 24,
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass"
                        style={{
                            width: '100%', maxWidth: 400,
                            borderRadius: 24, padding: '36px',
                            textAlign: 'center',
                            animation: 'fadeUp 0.25s ease',
                            border: '1px solid rgba(239,68,68,0.2)',
                        }}
                    >
                        <div style={{ fontSize: 52, marginBottom: 16 }}>🗑️</div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Hapus Foto?</h2>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 28 }}>
                            Foto ini akan dihapus permanen dari album dan storage. Tindakan ini tidak bisa dibatalkan.
                        </p>
                        {/* Preview of photo to be deleted */}
                        <div style={{ position: 'relative', width: '100%', height: 120, marginBottom: 24, opacity: 0.6 }}>
                            <Image
                                src={photo.image_url}
                                alt="photo to delete"
                                fill
                                style={{ objectFit: 'cover', borderRadius: 10 }}
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-secondary"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 100,
                                    border: '1px solid rgba(239,68,68,0.5)',
                                    background: 'rgba(239,68,68,0.2)',
                                    color: '#f87171', fontWeight: 600, fontSize: 14,
                                    cursor: isPending ? 'not-allowed' : 'pointer',
                                    fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.35)')}
                                onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                            >
                                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit/Replace Modal ── */}
            {showEditModal && (
                <div
                    onClick={() => { setShowEditModal(false); setPreview(null) }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 300,
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 24,
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass"
                        style={{
                            width: '100%', maxWidth: 460,
                            borderRadius: 24, padding: '36px',
                            animation: 'fadeUp 0.25s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Ganti Foto</h2>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Upload foto pengganti untuk slot ini.</p>
                            </div>
                            <button
                                onClick={() => { setShowEditModal(false); setPreview(null) }}
                                style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer', fontSize: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >✕</button>
                        </div>

                        {/* Side by side: old → new */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Foto Saat Ini</p>
                                <div style={{ position: 'relative', width: '100%', height: 120, opacity: 0.5 }}>
                                    <Image src={photo.image_url} alt="current" fill style={{ objectFit: 'cover', borderRadius: 10 }} sizes="(max-width: 768px) 50vw, 200px" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 20, paddingTop: 24 }}>→</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Foto Baru</p>
                                {preview ? (
                                    <div style={{ position: 'relative', width: '100%', height: 120 }}>
                                        <Image src={preview} alt="new preview" fill style={{ objectFit: 'cover', borderRadius: 10 }} unoptimized />
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '100%', height: 120, borderRadius: 10,
                                        border: '2px dashed rgba(251,191,36,0.3)',
                                        background: 'rgba(251,191,36,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.2)', fontSize: 24,
                                    }}>🖼️</div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
                                    Pilih Foto Baru *
                                </label>
                                <div
                                    style={{
                                        border: '2px dashed rgba(251,191,36,0.3)',
                                        borderRadius: 12, padding: '16px',
                                        textAlign: 'center',
                                        background: 'rgba(251,191,36,0.04)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>📁</div>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Klik untuk memilih foto (PNG, JPG, WEBP)</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        required
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            const f = e.target.files?.[0]
                                            if (f) setPreview(URL.createObjectURL(f))
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setPreview(null) }}
                                    className="btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="btn-primary"
                                    style={{ flex: 1, justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}
                                >
                                    {isPending ? 'Mengganti...' : 'Ganti Foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
