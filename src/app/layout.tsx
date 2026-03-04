import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'M Love — Modern Photo Portfolio',
  description: 'A curated photography portfolio built with Next.js and Supabase. Explore stunning albums and photos.',
  keywords: 'photography, gallery, portfolio, album, photos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noise">
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}