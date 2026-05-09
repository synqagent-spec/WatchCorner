'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Info, Star } from 'lucide-react'
import { backdropUrl } from '@/lib/embed-config'
import { genres, type MediaItem } from '@/lib/api'

interface HeroBannerProps {
  items: MediaItem[]
  onPlay: (item: MediaItem) => void
  onInfo: (item: MediaItem) => void
}

export function HeroBanner({ items, onPlay, onInfo }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentItem = items[currentIndex]

  useEffect(() => {
    if (items.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
        setIsTransitioning(false)
      }, 400)
    }, 8000)

    return () => clearInterval(interval)
  }, [items.length])

  if (!currentItem) {
    return (
      <div className="relative h-[70vh] lg:h-[85vh] bg-[#080d1a] shimmer" />
    )
  }

  const title = currentItem.title || currentItem.name || 'Unknown'
  const year = currentItem.release_date
    ? new Date(currentItem.release_date).getFullYear()
    : currentItem.first_air_date
    ? new Date(currentItem.first_air_date).getFullYear()
    : ''

  const genreNames = currentItem.genre_ids
    ?.slice(0, 3)
    .map((id) => genres[id])
    .filter(Boolean)

  return (
    <div className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={backdropUrl(currentItem.backdrop_path)}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04060f] via-[#04060f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-transparent to-transparent" />

      {/* Lens Flare Effects */}
      <div className="absolute top-20 right-20 w-96 h-96 lens-flare opacity-50" />
      <div className="absolute top-40 right-60 w-64 h-64 lens-flare opacity-30" />

      {/* Content */}
      <div
        className={`absolute bottom-20 lg:bottom-32 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-500 ${
          isTransitioning
            ? 'opacity-0 translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-[#E8F4FD] leading-tight text-balance">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-[#89CFF0]">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-mono text-sm">
                {currentItem.vote_average?.toFixed(1)}
              </span>
            </div>
            {year && (
              <span className="text-[#6BAED4] text-sm font-mono">{year}</span>
            )}
            {genreNames && genreNames.length > 0 && (
              <div className="flex gap-2">
                {genreNames.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 text-xs rounded-full bg-[#0d1526]/80 text-[#89CFF0] border border-[#89CFF0]/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          <p className="mt-4 text-sm sm:text-base text-[#E8F4FD]/80 line-clamp-3 leading-relaxed max-w-xl">
            {currentItem.overview}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => onPlay(currentItem)}
              className="flex items-center gap-2 px-6 py-3 bg-[#89CFF0] text-[#04060f] font-semibold rounded-lg hover:bg-[#B8E8FF] transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </button>
            <button
              onClick={() => onInfo(currentItem)}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[#89CFF0]/50 text-[#E8F4FD] rounded-lg hover:bg-[#89CFF0]/10 transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {items.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(idx)
                  setIsTransitioning(false)
                }, 400)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-[#89CFF0]'
                  : 'bg-[#E8F4FD]/30 hover:bg-[#E8F4FD]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
