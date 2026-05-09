'use client'

import { useEffect, useState } from 'react'
import { HeroBanner } from '@/components/hero-banner'
import { ContentRow } from '@/components/content-row'
import {
  fetchTrendingMovies,
  fetchTrendingTV,
  getTmdbId,
  type MediaItem,
} from '@/lib/api'

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string | number>) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [trendingMoviesDay, setTrendingMoviesDay] = useState<MediaItem[]>([])
  const [trendingMoviesWeek, setTrendingMoviesWeek] = useState<MediaItem[]>([])
  const [trendingTVWeek, setTrendingTVWeek] = useState<MediaItem[]>([])
  const [popularTV, setPopularTV] = useState<MediaItem[]>([])
  const [recents, setRecents] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedRecents = localStorage.getItem('watch_recents')
    if (savedRecents) {
      setRecents(JSON.parse(savedRecents))
    }

    const loadData = async () => {
      try {
        const [moviesDay, moviesWeek, tvWeek, tvDay] = await Promise.allSettled([
          fetchTrendingMovies('day'),
          fetchTrendingMovies('week'),
          fetchTrendingTV('week'),
          fetchTrendingTV('day'),
        ])

        if (moviesDay.status === 'fulfilled') {
          console.log('[v0] Movies Day:', moviesDay.value)
          setTrendingMoviesDay(moviesDay.value.results || [])
        } else {
          console.error('[v0] Movies Day failed:', moviesDay.reason)
        }

        if (moviesWeek.status === 'fulfilled') {
          setTrendingMoviesWeek(moviesWeek.value.results || [])
        } else {
          console.error('[v0] Movies Week failed:', moviesWeek.reason)
        }

        if (tvWeek.status === 'fulfilled') {
          console.log('[v0] TV Week:', tvWeek.value)
          setTrendingTVWeek(tvWeek.value.results || [])
        } else {
          console.error('[v0] TV Week failed:', tvWeek.reason)
        }

        if (tvDay.status === 'fulfilled') {
          setPopularTV(tvDay.value.results || [])
        } else {
          console.error('[v0] TV Day failed:', tvDay.reason)
        }
      } catch (error) {
        console.error('[v0] Failed to load trending data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleItemClick = (item: MediaItem, type: 'movie' | 'tv') => {
    const title = item.title || item.name || 'Unknown'
    onNavigate(type, { id: getTmdbId(item), title })
  }

  const handlePlayFromHero = (item: MediaItem) => {
    onNavigate('watch-movie', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  const handleInfoFromHero = (item: MediaItem) => {
    onNavigate('movie', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner
        items={trendingMoviesDay.slice(0, 5)}
        onPlay={handlePlayFromHero}
        onInfo={handleInfoFromHero}
      />

      {/* Content Rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8 pb-20">
        {recents.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={recents}
            type="movie"
            onItemClick={(item) => handleItemClick(item, item.title ? 'movie' : 'tv')}
          />
        )}

        <ContentRow
          title="Trending Today"
          items={trendingMoviesDay}
          type="movie"
          loading={loading}
          onItemClick={(item) => handleItemClick(item, 'movie')}
        />

        <ContentRow
          title="Trending TV Shows"
          items={trendingTVWeek}
          type="tv"
          loading={loading}
          onItemClick={(item) => handleItemClick(item, 'tv')}
        />

        <ContentRow
          title="Trending This Week"
          items={trendingMoviesWeek}
          type="movie"
          loading={loading}
          onItemClick={(item) => handleItemClick(item, 'movie')}
        />

        <ContentRow
          title="Trending TV Today"
          items={popularTV}
          type="tv"
          loading={loading}
          onItemClick={(item) => handleItemClick(item, 'tv')}
        />
      </div>
    </div>
  )
}
