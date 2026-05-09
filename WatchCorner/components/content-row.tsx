'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieCard, MovieCardSkeleton } from './movie-card'
import { getTmdbId, type MediaItem } from '@/lib/api'

interface ContentRowProps {
  title: string
  items: MediaItem[]
  type: 'movie' | 'tv'
  loading?: boolean
  onItemClick: (item: MediaItem) => void
}

export function ContentRow({
  title,
  items,
  type,
  loading = false,
  onItemClick,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScrollPosition)
      return () => ref.removeEventListener('scroll', checkScrollPosition)
    }
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="relative py-6">
      <h2 className="font-serif text-xl lg:text-2xl font-semibold text-[#E8F4FD] mb-4 crystal-underline inline-block">
        {title}
      </h2>

      <div className="group relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-card flex items-center justify-center text-[#89CFF0] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#89CFF0]/20"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 sm:w-40 lg:w-48">
                  <MovieCardSkeleton />
                </div>
              ))
            : items.map((item) => (
                <div
                  key={getTmdbId(item)}
                  className="flex-shrink-0 w-36 sm:w-40 lg:w-48"
                >
                  <MovieCard
                    item={item}
                    type={type}
                    onClick={() => onItemClick(item)}
                  />
                </div>
              ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && items.length > 0 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-card flex items-center justify-center text-[#89CFF0] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#89CFF0]/20"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  )
}
