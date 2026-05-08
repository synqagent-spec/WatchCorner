'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Star } from 'lucide-react'
import { posterUrl } from '@/lib/embed-config'
import type { MediaItem } from '@/lib/api'

interface MovieCardProps {
  item: MediaItem
  type: 'movie' | 'tv'
  onClick: () => void
}

export function MovieCard({ item, type, onClick }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const title = item.title || item.name || 'Unknown'
  const date = item.release_date || item.first_air_date
  const year = date ? new Date(date).getFullYear() : ''
  const rating = item.vote_average?.toFixed(1) || 'N/A'

  const getRatingColor = (score: number) => {
    if (score >= 7) return 'bg-emerald-500'
    if (score >= 5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <button
      onClick={onClick}
      className="group relative aspect-[2/3] rounded-lg overflow-hidden glass-card transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#89CFF0]/50"
    >
      {/* Poster Image */}
      <Image
        src={posterUrl(item.poster_path)}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        onError={() => setImageError(true)}
      />

      {/* Rating Badge */}
      <div
        className={`absolute top-2 right-2 ${getRatingColor(
          item.vote_average
        )} text-white text-xs font-mono font-medium px-2 py-1 rounded-md flex items-center gap-1`}
      >
        <Star className="w-3 h-3 fill-current" />
        {rating}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-sm font-semibold text-[#E8F4FD] line-clamp-2 text-left">
            {title}
          </h3>
          <p className="text-xs text-[#6BAED4] mt-1">{year}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#89CFF0] text-[#04060f]">
              <Play className="w-4 h-4 fill-current" />
            </span>
            <span className="text-xs text-[#89CFF0]">
              {type === 'movie' ? 'Watch' : 'View'}
            </span>
          </div>
        </div>
      </div>

      {/* Fallback Overlay (shown when no poster or on error) */}
      {(!item.poster_path || imageError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] to-[#0d1526] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[#89CFF0] text-2xl mb-2">🎬</div>
            <p className="text-xs text-[#6BAED4]">No poster</p>
          </div>
        </div>
      )}
    </button>
  )
}

// Skeleton Card for loading state
export function MovieCardSkeleton() {
  return (
    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#080d1a]">
      <div className="w-full h-full shimmer" />
    </div>
  )
}
