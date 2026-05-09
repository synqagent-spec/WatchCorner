'use client'

import { useEffect, useState } from 'react'
import { ContentRow } from '@/components/content-row'
import {
  getTmdbId,
  type MediaItem,
} from '@/lib/api'

interface MoviesPageProps {
  onNavigate: (page: string, params?: Record<string, string | number>) => void
}

export function MoviesPage({ onNavigate }: MoviesPageProps) {
  const [popular, setPopular] = useState<MediaItem[]>([])
  const [topRated, setTopRated] = useState<MediaItem[]>([])
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([])
  const [upcoming, setUpcoming] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pop, top, now, up] = await Promise.allSettled([
          fetch('/api/movies/popular').then(res => res.json()),
          fetch('/api/movies/top_rated').then(res => res.json()),
          fetch('/api/movies/now_playing').then(res => res.json()),
          fetch('/api/movies/upcoming').then(res => res.json()),
        ])

        if (pop.status === 'fulfilled') setPopular(pop.value.results || [])
        if (top.status === 'fulfilled') setTopRated(top.value.results || [])
        if (now.status === 'fulfilled') setNowPlaying(now.value.results || [])
        if (up.status === 'fulfilled') setUpcoming(up.value.results || [])
      } catch (error) {
        console.error('Failed to load movies data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleItemClick = (item: MediaItem) => {
    const title = item.title || item.name || 'Unknown'
    onNavigate('movie', { id: getTmdbId(item), title })
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#E8F4FD] mb-8">
          Explore Movies
        </h1>

        <ContentRow
          title="Popular Movies"
          items={popular}
          type="movie"
          loading={loading}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title="Now Playing"
          items={nowPlaying}
          type="movie"
          loading={loading}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title="Top Rated"
          items={topRated}
          type="movie"
          loading={loading}
          onItemClick={handleItemClick}
        />

        <ContentRow
          title="Upcoming"
          items={upcoming}
          type="movie"
          loading={loading}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  )
}
