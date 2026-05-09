'use client'

import { useEffect, useState } from 'react'
import { ContentRow } from '@/components/content-row'
import { getTmdbId, type MediaItem } from '@/lib/api'

interface TVShowsPageProps {
  onNavigate: (page: string, params?: Record<string, string | number>) => void
}

export function TVShowsPage({ onNavigate }: TVShowsPageProps) {
  const [popular, setPopular] = useState<MediaItem[]>([])
  const [topRated, setTopRated] = useState<MediaItem[]>([])
  const [onTheAir, setOnTheAir] = useState<MediaItem[]>([])
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [popularRes, topRatedRes, onTheAirRes, trendingRes] = await Promise.allSettled([
          fetch('/api/tv/popular').then(res => res.json()),
          fetch('/api/tv/top_rated').then(res => res.json()),
          fetch('/api/tv/on_the_air').then(res => res.json()),
          fetch('/api/tv/trending').then(res => res.json()),
        ])

        if (popularRes.status === 'fulfilled') setPopular(popularRes.value.results || [])
        if (topRatedRes.status === 'fulfilled') setTopRated(topRatedRes.value.results || [])
        if (onTheAirRes.status === 'fulfilled') setOnTheAir(onTheAirRes.value.results || [])
        if (trendingRes.status === 'fulfilled') setTrending(trendingRes.value.results || [])
      } catch (error) {
        console.error('Failed to load TV shows:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleItemClick = (item: MediaItem) => {
    onNavigate('tv', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#E8F4FD] mb-8">
          Explore TV Shows
        </h1>

        <div className="space-y-8">
          <ContentRow
            title="Trending This Week"
            items={trending}
            type="tv"
            loading={loading}
            onItemClick={handleItemClick}
          />

          <ContentRow
            title="Popular Shows"
            items={popular}
            type="tv"
            loading={loading}
            onItemClick={handleItemClick}
          />

          <ContentRow
            title="Top Rated"
            items={topRated}
            type="tv"
            loading={loading}
            onItemClick={handleItemClick}
          />

          <ContentRow
            title="On The Air"
            items={onTheAir}
            type="tv"
            loading={loading}
            onItemClick={handleItemClick}
          />
        </div>
      </div>
    </div>
  )
}
