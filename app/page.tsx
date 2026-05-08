'use client'

import { useState, useCallback } from 'react'
import { Navbar } from '@/components/navbar'
import { HomePage } from '@/components/pages/home-page'
import { MoviesPage } from '@/components/pages/movies-page'
import { SearchPage } from '@/components/pages/search-page'
import { MovieDetailPage } from '@/components/pages/movie-detail-page'
import { TVDetailPage } from '@/components/pages/tv-detail-page'
import { WatchMoviePage } from '@/components/pages/watch-movie-page'
import { WatchTVPage } from '@/components/pages/watch-tv-page'

type PageParams = Record<string, string | number>

interface NavigationState {
  page: string
  params: PageParams
}

export default function MovieCorner() {
  const [history, setHistory] = useState<NavigationState[]>([
    { page: 'home', params: {} },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const currentState = history[historyIndex]

  const navigate = useCallback(
    (page: string, params: PageParams = {}) => {
      // Remove any forward history when navigating to a new page
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({ page, params })
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [history, historyIndex]
  )

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [historyIndex])

  const handleSearch = useCallback(
    (query: string) => {
      navigate('search', { query })
    },
    [navigate]
  )

  const renderPage = () => {
    const { page, params } = currentState

    switch (page) {
      case 'home':
        return <HomePage onNavigate={navigate} />
      case 'movies':
        return <MoviesPage onNavigate={navigate} />
      case 'tvshows':
        return <HomePage onNavigate={navigate} />

      case 'search':
        return (
          <SearchPage
            query={String(params.query || '')}
            onNavigate={navigate}
          />
        )

      case 'movie':
        return (
          <MovieDetailPage
            tmdbId={String(params.id)}
            onNavigate={navigate}
            onBack={goBack}
          />
        )

      case 'tv':
        return (
          <TVDetailPage
            tmdbId={String(params.id)}
            onNavigate={navigate}
            onBack={goBack}
          />
        )

      case 'watch-movie':
        return (
          <WatchMoviePage
            tmdbId={String(params.id)}
            title={String(params.title || 'Movie')}
            onNavigate={navigate}
            onBack={goBack}
          />
        )

      case 'watch-tv':
        return (
          <WatchTVPage
            tmdbId={String(params.id)}
            title={String(params.title || 'TV Show')}
            season={Number(params.season) || 1}
            episode={Number(params.episode) || 1}
            onNavigate={navigate}
            onBack={goBack}
          />
        )

      default:
        return <HomePage onNavigate={navigate} />
    }
  }

  return (
    <main className="min-h-screen bg-[#04060f]">
      <Navbar
        onNavigate={navigate}
        currentPage={currentState.page}
        onSearch={handleSearch}
      />
      {renderPage()}
    </main>
  )
}
