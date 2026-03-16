'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateAlbum, deleteAlbum } from '../../app/admin/dashboard/actions'

interface Album {
    id: string
    title: string
    description: string | null
    created_at: string
}

interface Props {
    album: Album
}

export default function AlbumActions({ album }: Props) {
    const [showEdit, setShowEdit] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
                {/* Edit button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEdit(true) }}
                    title="Edit Album"
                    className="glass-hover"
                    style={{
                        width: 36, height: 36, borderRadius: 10,
                        border: '1px solid rgba(232,201,122,0.15)',
                        background: 'rgba(232,201,122,0.05)',
                        color: '#e8c97a',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', fontSize: 16, flexShrink: 0,
                    }}
                >✏️</button>

                {/* Delete button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDelete(true) }}
                    title="Hapus Album"
                    className="glass-hover"
                    style={{
                        width: 36, height: 36, borderRadius: 10,
                        border: '1px solid rgba(239,68,68,0.15)',
                        background: 'rgba(239,68,68,0.05)',
                        color: '#f87171',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', fontSize: 16, flexShrink: 0,
                    }}
                >🗑️</button>
            </div>

            {/* ── Edit Modal ── */}
            {mounted && showEdit && createPortal(
                <div
                    onClick={() => setShowEdit(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 24, animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass"
                        style={{
                            width: '100%', maxWidth: 480,
                            borderRadius: 24, padding: '32px 36px',
                            animation: 'fadeUp 0.25s ease',
                            border: '1px solid rgba(232,201,122,0.12)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>Edit Album</h2>
                                <p style={{ fontSize: 13, color: 'rgba(255,220,225,0.4)', marginTop: 4 }}>Ubah judul dan deskripsi album.</p>
                            </div>
                            <button
                                onClick={() => setShowEdit(false)}
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

                        <form
                            action={(formData) => {
                                startTransition(() => { updateAlbum(formData) })
                                setShowEdit(false)
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                        >
                            <input type="hidden" name="id" value={album.id} />
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 8 }}>
                                    Judul Album *
                                </label>
                                <input name="title" defaultValue={album.title} required className="input-field" placeholder="Judul Album" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,220,225,0.55)', marginBottom: 8 }}>
                                    Deskripsi
                                </label>
                                <textarea name="description" defaultValue={album.description ?? ''} rows={3} className="input-field" placeholder="Ceritakan momen ini..." style={{ resize: 'vertical', minHeight: 90 }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowEdit(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-primary" disabled={isPending} style={{ flex: 1, justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}>
                                    {isPending ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* ── Delete Confirm Modal ── */}
            {mounted && showDelete && createPortal(
                <div
                    onClick={() => setShowDelete(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 24, animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass"
                        style={{
                            width: '100%', maxWidth: 420,
                            borderRadius: 24, padding: '36px',
                            animation: 'fadeUp 0.25s ease', textAlign: 'center',
                            border: '1px solid rgba(239,68,68,0.15)',
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Hapus Album?</h2>
                        <p style={{ fontSize: 14, color: 'rgba(255,220,225,0.45)', lineHeight: 1.6, marginBottom: 28 }}>
                            Album <strong style={{ color: '#fef2f2' }}>&ldquo;{album.title}&rdquo;</strong> dan semua fotonya akan dihapus permanen.
                        </p>

                        <form
                            action={(formData) => {
                                startTransition(() => { deleteAlbum(formData) })
                                setShowDelete(false)
                            }}
                            style={{ display: 'flex', gap: 12 }}
                        >
                            <input type="hidden" name="id" value={album.id} />
                            <button type="button" onClick={() => setShowDelete(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                style={{
                                    flex: 1, padding: '12px 24px', borderRadius: 100,
                                    border: '1px solid rgba(239,68,68,0.4)',
                                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                                    transition: 'all 0.2s', opacity: isPending ? 0.7 : 1,
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
                                onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                            >
                                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
