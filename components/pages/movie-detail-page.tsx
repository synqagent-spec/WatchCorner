'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Play, Star, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { ContentRow } from '@/components/content-row'
import { posterUrl, backdropUrl, profileUrl } from '@/lib/embed-config'
import { getFullDetails, getSimilar } from '@/lib/tmdb'
import { getTmdbId, type MediaDetail, type MediaItem } from '@/lib/api'

interface MovieDetailPageProps {
  tmdbId: string
  onNavigate: (page: string, params?: Record<string, string | number>) => void
  onBack: () => void
}

export function MovieDetailPage({
  tmdbId,
  onNavigate,
  onBack,
}: MovieDetailPageProps) {
  const [movie, setMovie] = useState<MediaDetail | null>(null)
  const [similar, setSimilar] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const movieId = parseInt(tmdbId as string)
        const [movieData, similarData] = await Promise.all([
          getFullDetails('movie', movieId),
          getSimilar('movie', movieId),
        ])
        setMovie(movieData)
        setSimilar(similarData.results || [])
      } catch (error) {
        console.error('Failed to load movie details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [tmdbId])

  const handleWatch = () => {
    if (movie) {
      onNavigate('watch-movie', {
        id: getTmdbId(movie),
        title: movie.title || 'Movie',
      })
    }
  }

  const handleSimilarClick = (item: MediaItem) => {
    onNavigate('movie', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="h-[60vh] shimmer" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-[#6BAED4]">Movie not found</p>
      </div>
    )
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : ''

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] lg:h-[80vh]">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <Image
            src={backdropUrl(movie.backdrop_path)}
            alt={movie.title || 'Movie'}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060f] via-[#04060f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-transparent to-[#04060f]/30" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:left-8 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1526]/80 backdrop-blur-sm border border-[#89CFF0]/20 text-[#E8F4FD] hover:bg-[#0d1526] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="hidden lg:block flex-shrink-0 w-64 -mb-32">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-card">
                <Image
                  src={posterUrl(movie.poster_path)}
                  alt={movie.title || 'Movie'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 lg:pt-8">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#E8F4FD] text-balance">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-2 text-[#6BAED4] italic">
                  &quot;{movie.tagline}&quot;
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-[#89CFF0]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-mono">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1 text-[#6BAED4]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{movie.runtime} min</span>
                  </div>
                )}
                {year && (
                  <div className="flex items-center gap-1 text-[#6BAED4]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{year}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-sm rounded-full bg-[#0d1526]/80 text-[#89CFF0] border border-[#89CFF0]/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="mt-6 text-[#E8F4FD]/80 leading-relaxed max-w-2xl">
                {movie.overview}
              </p>

              {/* Watch Button */}
              <button
                onClick={handleWatch}
                className="mt-8 flex items-center gap-2 px-8 py-4 bg-[#89CFF0] text-[#04060f] font-semibold rounded-lg hover:bg-[#B8E8FF] transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-40">
          <h2 className="font-serif text-2xl font-semibold text-[#E8F4FD] mb-6 crystal-underline inline-block">
            Cast
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {movie.cast.slice(0, 10).map((person, idx) => (
              <div key={idx} className="flex-shrink-0 text-center w-28">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#89CFF0]/30">
                  <Image
                    src={profileUrl(person.profile_path)}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-[#E8F4FD] font-medium line-clamp-1">
                  {person.name}
                </p>
                <p className="text-xs text-[#6BAED4] line-clamp-1">
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <ContentRow
            title="More Like This"
            items={similar}
            type="movie"
            onItemClick={handleSimilarClick}
          />
        </div>
      )}
    </div>
  )
}
