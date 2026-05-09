'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, X, Menu } from 'lucide-react'

interface NavbarProps {
  onNavigate: (page: string, params?: Record<string, string | number>) => void
  currentPage: string
  onSearch: (query: string) => void
}

export function Navbar({ onNavigate, currentPage, onSearch }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Movies', page: 'movies' },
    { label: 'TV Shows', page: 'tvshows' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#04060f]/90 backdrop-blur-xl border-b border-[#89CFF0]/20'
          : 'bg-gradient-to-b from-[#04060f] to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image
                src="/logo.png"
                alt="MovieCorner"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl lg:text-2xl font-semibold text-[#E8F4FD] group-hover:text-[#89CFF0] transition-colors">
                MovieCorner
              </h1>
              <span className="text-[10px] font-mono text-[#6BAED4] tracking-wider">
                by Synaptom
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`text-sm font-medium transition-all duration-200 relative ${
                  currentPage === link.page
                    ? 'text-[#89CFF0]'
                    : 'text-[#E8F4FD]/80 hover:text-[#89CFF0]'
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#89CFF0] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies & TV..."
                    autoFocus
                    className="w-48 sm:w-64 bg-[#0d1526] border border-[#89CFF0]/30 rounded-lg px-4 py-2 text-sm text-[#E8F4FD] placeholder-[#6BAED4] focus:outline-none focus:border-[#89CFF0] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="ml-2 p-2 text-[#6BAED4] hover:text-[#89CFF0] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#E8F4FD]/80 hover:text-[#89CFF0] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#E8F4FD]/80 hover:text-[#89CFF0] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#89CFF0]/10">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page)
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-all ${
                    currentPage === link.page
                      ? 'bg-[#89CFF0]/10 text-[#89CFF0]'
                      : 'text-[#E8F4FD]/80 hover:bg-[#0d1526]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
