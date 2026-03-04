'use client'

import { useState, useCallback } from 'react'

import Image from 'next/image'

interface Photo {
    id: string
    image_url: string
    created_at: string
}

interface Props {
    photos: Photo[]
}

export default function GalleryLightbox({ photos }: Props) {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

    const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), [])
    const closeLightbox = useCallback(() => setLightboxIdx(null), [])
    const prev = useCallback(() => setLightboxIdx(i => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length])
    const next = useCallback(() => setLightboxIdx(i => (i === null ? null : (i + 1) % photos.length)), [photos.length])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
    }, [closeLightbox, prev, next])

    return (
        <>
            {/* Masonry Grid */}
            <div style={{ columns: 'auto 280px', gap: 16 }}>
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        className="photo-card animate-fade-up"
                        style={{
                            marginBottom: 16,
                            animationDelay: `${i * 0.05}s`,
                            animationFillMode: 'both',
                            cursor: 'pointer',
                            position: 'relative',
                            breakInside: 'avoid',
                            display: 'inline-block',
                            width: '100%',
                        }}
                        onClick={() => openLightbox(i)}
                    >
                        <div style={{ position: 'relative', width: '100%', height: 280, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                            <Image
                                src={photo.image_url}
                                alt={`Foto ${i + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                        <div className="overlay" style={{ borderRadius: 14 }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}>🔍</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="lightbox-overlay"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    style={{ outline: 'none' }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'fixed', top: 20, right: 20,
                            width: 44, height: 44, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff', fontSize: 20, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(8px)', zIndex: 1001,
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                    >✕</button>

                    {/* Prev */}
                    {photos.length > 1 && (
                        <button
                            onClick={e => { e.stopPropagation(); prev() }}
                            style={{
                                position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', fontSize: 20, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(8px)', zIndex: 1001,
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.3)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        >‹</button>
                    )}

                    {/* Image */}
                    <div style={{ position: 'relative', width: '90vw', height: '90vh', maxWidth: 1200 }}>
                        <Image
                            src={photos[lightboxIdx].image_url}
                            alt={`Foto ${lightboxIdx + 1}`}
                            className="lightbox-img"
                            onClick={e => e.stopPropagation()}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="90vw"
                        />
                    </div>

                    {/* Next */}
                    {photos.length > 1 && (
                        <button
                            onClick={e => { e.stopPropagation(); next() }}
                            style={{
                                position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', fontSize: 20, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(8px)', zIndex: 1001,
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.3)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        >›</button>
                    )}

                    {/* Counter */}
                    <div style={{
                        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 100, padding: '6px 18px',
                        fontSize: 13, color: 'rgba(255,220,225,0.8)', fontWeight: 500,
                        zIndex: 1001,
                    }}>
                        {lightboxIdx + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    )
}
