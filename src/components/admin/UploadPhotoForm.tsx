'use client'

import { useRef, useState, useCallback } from 'react'
import { uploadPhoto } from '../../app/admin/albums/[id]/actions'
import { compressImage } from '../../lib/imageCompression'

interface Props {
    albumId: string
}

interface FileItem {
    file: File
    preview: string
    status: 'pending' | 'uploading' | 'done' | 'error'
    error?: string
}

export function UploadPhotoForm({ albumId }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<FileItem[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedCount, setUploadedCount] = useState(0)

    const addFiles = useCallback((incoming: FileList | File[]) => {
        const imageFiles = Array.from(incoming).filter(f => f.type.startsWith('image/'))
        if (!imageFiles.length) return

        const newItems: FileItem[] = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            status: 'pending',
        }))

        setFiles(prev => [...prev, ...newItems])
    }, [])

    // ── Drag & Drop handlers ──
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        addFiles(e.dataTransfer.files)
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files)
        // reset input value agar file yang sama bisa dipilih ulang
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setFiles(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleUpload = async () => {
        const pending = files.filter(f => f.status === 'pending')
        if (!pending.length) return

        setIsUploading(true)
        setUploadedCount(0)
        let successCount = 0

        for (let i = 0; i < files.length; i++) {
            if (files[i].status !== 'pending') continue

            // Mark as uploading
            setFiles(prev => {
                const clone = [...prev]
                clone[i] = { ...clone[i], status: 'uploading' }
                return clone
            })

            try {
                const compressed = await compressImage(files[i].file)
                const formData = new FormData()
                formData.set('albumId', albumId)
                formData.set('file', compressed)
                await uploadPhoto(formData)

                setFiles(prev => {
                    const clone = [...prev]
                    clone[i] = { ...clone[i], status: 'done' }
                    return clone
                })
                successCount++
                setUploadedCount(successCount)
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Gagal upload'
                setFiles(prev => {
                    const clone = [...prev]
                    clone[i] = { ...clone[i], status: 'error', error: msg }
                    return clone
                })
            }
        }

        setIsUploading(false)

        // Auto-clear done files after a short delay
        setTimeout(() => {
            setFiles(prev => {
                prev.filter(f => f.status === 'done').forEach(f => URL.revokeObjectURL(f.preview))
                return prev.filter(f => f.status !== 'done')
            })
        }, 1500)
    }

    const pendingCount = files.filter(f => f.status === 'pending').length
    const totalCount = files.length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* ── Drop Zone ── */}
            <div
                onClick={() => !isUploading && inputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'rgba(244,63,94,0.8)' : 'rgba(244,63,94,0.3)'}`,
                    borderRadius: 14,
                    padding: '28px 20px',
                    textAlign: 'center',
                    background: isDragging ? 'rgba(244,63,94,0.10)' : 'rgba(244,63,94,0.04)',
                    cursor: isUploading ? 'default' : 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                    userSelect: 'none',
                }}
            >
                <div style={{ fontSize: 30, marginBottom: 8 }}>
                    {isDragging ? '📂' : '🖼️'}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,220,225,0.8)', marginBottom: 4 }}>
                    {isDragging ? 'Lepaskan di sini!' : 'Tap atau drag foto ke sini'}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,220,225,0.35)' }}>
                    PNG, JPG, WEBP · Bisa pilih banyak sekaligus
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onInputChange}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                />
            </div>

            {/* ── File Preview List ── */}
            {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,220,225,0.4)', marginBottom: 2 }}>
                        {totalCount} foto dipilih · {pendingCount} menunggu upload
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                            gap: 8,
                            maxHeight: 260,
                            overflowY: 'auto',
                            padding: '2px 2px 4px',
                        }}
                    >
                        {files.map((item, i) => (
                            <div
                                key={item.preview}
                                style={{
                                    position: 'relative',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    aspectRatio: '1',
                                    border: item.status === 'error'
                                        ? '2px solid rgba(255,80,80,0.7)'
                                        : item.status === 'done'
                                            ? '2px solid rgba(80,220,120,0.7)'
                                            : item.status === 'uploading'
                                                ? '2px solid rgba(244,63,94,0.7)'
                                                : '2px solid rgba(244,63,94,0.2)',
                                    transition: 'border-color 0.3s',
                                }}
                            >
                                {/* Preview image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.preview}
                                    alt={item.file.name}
                                    style={{
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        opacity: item.status === 'uploading' ? 0.5 : 1,
                                        transition: 'opacity 0.3s',
                                    }}
                                />

                                {/* Status overlay */}
                                {item.status === 'uploading' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.35)',
                                        fontSize: 18,
                                    }}>
                                        ⏳
                                    </div>
                                )}
                                {item.status === 'done' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.35)',
                                        fontSize: 20,
                                    }}>
                                        ✅
                                    </div>
                                )}
                                {item.status === 'error' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.45)',
                                        fontSize: 18,
                                    }}
                                        title={item.error}
                                    >
                                        ❌
                                    </div>
                                )}

                                {/* Remove button (only when pending) */}
                                {item.status === 'pending' && !isUploading && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                                        style={{
                                            position: 'absolute', top: 3, right: 3,
                                            width: 20, height: 20, borderRadius: '50%',
                                            background: 'rgba(0,0,0,0.65)',
                                            border: 'none', color: '#fff',
                                            fontSize: 11, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            lineHeight: 1,
                                        }}
                                        aria-label="Hapus"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Upload Button ── */}
            {pendingCount > 0 && (
                <button
                    type="button"
                    className="btn-primary"
                    style={{ justifyContent: 'center' }}
                    disabled={isUploading}
                    onClick={handleUpload}
                >
                    {isUploading ? (
                        <>
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                            Mengupload {uploadedCount}/{pendingCount}…
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                            Upload {pendingCount} Foto
                        </>
                    )}
                </button>
            )}

            {/* Add more button (when there are already files but not uploading) */}
            {files.length > 0 && !isUploading && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    style={{
                        background: 'transparent',
                        border: '1px dashed rgba(244,63,94,0.3)',
                        color: 'rgba(255,200,210,0.55)',
                        borderRadius: 10, padding: '8px 12px',
                        fontSize: 12, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: 14 }}>＋</span> Tambah foto lagi
                </button>
            )}
        </div>
    )
}
