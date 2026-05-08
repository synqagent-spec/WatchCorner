import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Cinzel } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans'
})

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  weight: ['400', '500'],
  variable: '--font-dm-mono'
})

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel'
})

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
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${cinzel.variable}`}>
      <body className="font-sans antialiased bg-[#04060f] text-[#E8F4FD] min-h-screen">
        {children}
      </body>
    </html>
  )
}
