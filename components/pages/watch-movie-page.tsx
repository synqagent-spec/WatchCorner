'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Star, Play } from 'lucide-react'
import { ContentRow } from '@/components/content-row'
import { getMovieEmbedUrl, posterUrl, profileUrl } from '@/lib/embed-config'
import {
  fetchMovieDetail,
  fetchSimilarMovies,
  fetchTrendingMovies,
  getTmdbId,
  type MediaDetail,
  type MediaItem,
} from '@/lib/api'

interface WatchMoviePageProps {
  tmdbId: string
  title: string
  onNavigate: (page: string, params?: Record<string, string | number>) => void
  onBack: () => void
}

export function WatchMoviePage({
  tmdbId,
  title,
  onNavigate,
  onBack,
}: WatchMoviePageProps) {
  const [movie, setMovie] = useState<MediaDetail | null>(null)
  const [similar, setSimilar] = useState<MediaItem[]>([])
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [embedFallback, setEmbedFallback] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieData, similarData, trendingData] = await Promise.all([
          fetchMovieDetail(tmdbId),
          fetchSimilarMovies(tmdbId),
          fetchTrendingMovies('day'),
        ])
        setMovie(movieData)
        setSimilar(similarData.results || [])
        setTrending(trendingData.results || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [tmdbId])

  const handleSimilarClick = (item: MediaItem) => {
    onNavigate('watch-movie', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  const handleTrendingClick = (item: MediaItem) => {
    onNavigate('movie', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-[#6BAED4] hover:text-[#89CFF0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Player */}
            <div className="relative aspect-video rounded-lg overflow-hidden glass-card">
              <iframe
                src={getMovieEmbedUrl(tmdbId)}
                title={title}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onError={() => setEmbedFallback(true)}
              />
              {embedFallback && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1526]/80 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-[#E8F4FD] mb-2">Using fallback embed source</p>
                    <p className="text-xs text-[#6BAED4]">Try refreshing if video doesn&apos;t load</p>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Info */}
            {movie && (
              <div className="mt-6">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#E8F4FD]">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-[#89CFF0]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-mono">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  {movie.runtime && (
                    <span className="text-[#6BAED4] text-sm">
                      {movie.runtime} min
                    </span>
                  )}
                  {movie.release_date && (
                    <span className="text-[#6BAED4] text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 text-xs rounded-full bg-[#0d1526] text-[#89CFF0] border border-[#89CFF0]/20"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-6 text-[#E8F4FD]/80 leading-relaxed">
                  {movie.overview}
                </p>

                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="mt-8">
                    <h2 className="font-serif text-xl font-semibold text-[#E8F4FD] mb-4">
                      Cast
                    </h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                      {movie.cast.slice(0, 8).map((person, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 text-center w-20"
                        >
                          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#89CFF0]/30">
                            <Image
                              src={profileUrl(person.profile_path)}
                              alt={person.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-2 text-xs text-[#E8F4FD] line-clamp-1">
                            {person.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Similar Movies */}
            {similar.length > 0 && (
              <div className="mt-8">
                <ContentRow
                  title="More Like This"
                  items={similar}
                  type="movie"
                  onItemClick={handleSimilarClick}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Trending */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-[#E8F4FD] mb-4 crystal-underline inline-block">
                Trending Now
              </h2>
              <div className="space-y-3">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex gap-3 p-2">
                        <div className="w-16 h-24 shimmer rounded-md" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 shimmer rounded" />
                          <div className="h-3 w-1/2 shimmer rounded" />
                        </div>
                      </div>
                    ))
                  : trending.slice(0, 8).map((item) => (
                      <button
                        key={getTmdbId(item)}
                        onClick={() => handleTrendingClick(item)}
                        className="flex gap-3 w-full p-2 rounded-lg glass-card hover:border-[#89CFF0]/40 transition-all group text-left"
                      >
                        <div className="relative w-16 h-24 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={posterUrl(item.poster_path)}
                            alt={item.title || item.name || 'Movie'}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 text-[#89CFF0] fill-current" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h3 className="text-sm font-medium text-[#E8F4FD] line-clamp-2 group-hover:text-[#89CFF0] transition-colors">
                            {item.title || item.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-[#89CFF0] fill-current" />
                            <span className="text-xs text-[#6BAED4] font-mono">
                              {item.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
