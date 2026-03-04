'use client'

import { useEffect, useState } from 'react'

const ALL_HEARTS = ['💕', '✨', '🌸', '💗', '⭐', '🌹', '💖', '✦']

interface HeartProps {
    emoji: string
    style: React.CSSProperties
}

function FloatingHeart({ emoji, style }: HeartProps) {
    return (
        <div
            className="heart-deco"
            style={{
                fontSize: '20px',
                opacity: 0,
                ...style,
            }}
        >
            {emoji}
        </div>
    )
}

export default function FloatingHearts({ count = 6 }: { count?: number }) {
    const [hearts, setHearts] = useState<HeartProps[]>([])

    useEffect(() => {
        const newHearts: HeartProps[] = Array.from({ length: count }).map(() => ({
            emoji: ALL_HEARTS[Math.floor(Math.random() * ALL_HEARTS.length)],
            style: {
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                '--dx': `${(Math.random() - 0.5) * 100}px`,
                '--dy': `${-Math.random() * 150 - 50}px`,
                '--dr': `${(Math.random() - 0.5) * 60}deg`,
                '--dur': `${6 + Math.random() * 6}s`,
                '--delay': `${Math.random() * 10}s`,
            } as React.CSSProperties,
        }))
        // It's safe to set state here once on mount for randomized client-side values
        // to avoid hydration mismatch between server and client.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHearts(newHearts)
    }, [count])

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {hearts.map((h, i) => (
                <FloatingHeart key={i} emoji={h.emoji} style={h.style} />
            ))}
        </div>
    )
}
