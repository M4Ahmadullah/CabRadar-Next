import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Load fonts in layout.tsx
const hammersmithOne = localFont({
  src: '../../public/fonts/HammersmithOne-Regular.ttf',
  variable: '--font-hammersmith',
  display: 'swap',
});

const gillSans = localFont({
  src: '../../public/fonts/Gill_Sans_MT.ttf',
  variable: '--font-gill-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CabRadar - Disruption Information',
  description: 'Real-time disruption and event information for London',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className={`${hammersmithOne.variable} ${gillSans.variable} mobile-container`}>
        {children}
      </body>
    </html>
  )
}
