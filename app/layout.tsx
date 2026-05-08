import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MovieCorner - Stream Movies & TV Shows',
  description: 'Your ultimate destination for streaming movies and TV shows. Discover trending content, explore new releases, and watch your favorites.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport = {
  themeColor: '#04060f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#04060f] text-[#E8F4FD] min-h-screen">
        {children}
      </body>
    </html>
  )
}
