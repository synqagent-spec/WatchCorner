'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Play, Star, Calendar, ArrowLeft, ChevronDown } from 'lucide-react'
import { ContentRow } from '@/components/content-row'
import { posterUrl, backdropUrl, profileUrl } from '@/lib/embed-config'
import {
  fetchTVDetail,
  fetchSimilarTV,
  fetchSeasonDetail,
  getTmdbId,
  type MediaDetail,
  type MediaItem,
  type Episode,
} from '@/lib/api'

interface TVDetailPageProps {
  tmdbId: string
  onNavigate: (page: string, params?: Record<string, string | number>) => void
  onBack: () => void
}

export function TVDetailPage({ tmdbId, onNavigate, onBack }: TVDetailPageProps) {
  const [show, setShow] = useState<MediaDetail | null>(null)
  const [similar, setSimilar] = useState<MediaItem[]>([])
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [episodesLoading, setEpisodesLoading] = useState(false)
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tvData, similarData] = await Promise.all([
          fetchTVDetail(tmdbId),
          fetchSimilarTV(tmdbId),
        ])
        setShow(tvData)
        setSimilar(similarData.results || [])
      } catch (error) {
        console.error('Failed to load TV details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [tmdbId])

  useEffect(() => {
    const loadEpisodes = async () => {
      if (!show) return
      setEpisodesLoading(true)
      try {
        const seasonData = await fetchSeasonDetail(tmdbId, selectedSeason)
        setEpisodes(seasonData.episodes || [])
      } catch (error) {
        console.error('Failed to load episodes:', error)
        setEpisodes([])
      } finally {
        setEpisodesLoading(false)
      }
    }
    loadEpisodes()
  }, [tmdbId, selectedSeason, show])

  const handleWatchEpisode = (episodeNumber: number) => {
    if (show) {
      onNavigate('watch-tv', {
        id: getTmdbId(show),
        title: show.name || 'TV Show',
        season: selectedSeason,
        episode: episodeNumber,
      })
    }
  }

  const handleSimilarClick = (item: MediaItem) => {
    onNavigate('tv', {
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

  if (!show) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-[#6BAED4]">TV Show not found</p>
      </div>
    )
  }

  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : ''

  const seasons = show.number_of_seasons || 1

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh]">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <Image
            src={backdropUrl(show.backdrop_path)}
            alt={show.name || 'TV Show'}
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
            <div className="hidden lg:block flex-shrink-0 w-56 -mb-32">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-card">
                <Image
                  src={posterUrl(show.poster_path)}
                  alt={show.name || 'TV Show'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 lg:pt-8">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#E8F4FD] text-balance">
                {show.name}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-[#89CFF0]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-mono">
                    {show.vote_average?.toFixed(1)}
                  </span>
                </div>
                <span className="text-[#6BAED4] text-sm">
                  {seasons} Season{seasons > 1 ? 's' : ''}
                </span>
                {year && (
                  <div className="flex items-center gap-1 text-[#6BAED4]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{year}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {show.genres && show.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {show.genres.map((genre) => (
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
                {show.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Season & Episode Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h2 className="font-serif text-2xl font-semibold text-[#E8F4FD] crystal-underline inline-block">
            Episodes
          </h2>

          {/* Season Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1526] border border-[#89CFF0]/20 text-[#E8F4FD] hover:border-[#89CFF0]/50 transition-colors"
            >
              Season {selectedSeason}
              <ChevronDown className="w-4 h-4" />
            </button>
            {seasonDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 z-20 bg-[#0d1526] border border-[#89CFF0]/20 rounded-lg overflow-hidden shadow-xl">
                {Array.from({ length: seasons }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedSeason(num)
                      setSeasonDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#89CFF0]/10 transition-colors ${
                      selectedSeason === num
                        ? 'text-[#89CFF0] bg-[#89CFF0]/10'
                        : 'text-[#E8F4FD]'
                    }`}
                  >
                    Season {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Episodes Grid */}
        {episodesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 shimmer rounded-lg" />
            ))}
          </div>
        ) : episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((ep) => (
              <button
                key={ep.episode_number}
                onClick={() => handleWatchEpisode(ep.episode_number)}
                className="group flex gap-4 p-4 rounded-lg glass-card text-left hover:border-[#89CFF0]/40 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#89CFF0]/10 flex items-center justify-center group-hover:bg-[#89CFF0] transition-colors">
                  <Play className="w-5 h-5 text-[#89CFF0] group-hover:text-[#04060f] fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-[#6BAED4]">
                    Episode {ep.episode_number}
                  </p>
                  <h3 className="text-sm font-medium text-[#E8F4FD] line-clamp-1">
                    {ep.name}
                  </h3>
                  {ep.air_date && (
                    <p className="text-xs text-[#6BAED4] mt-1">{ep.air_date}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[#6BAED4]">No episodes available</p>
        )}
      </div>

      {/* Cast Section */}
      {show.cast && show.cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <h2 className="font-serif text-2xl font-semibold text-[#E8F4FD] mb-6 crystal-underline inline-block">
            Cast
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {show.cast.slice(0, 10).map((person, idx) => (
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

      {/* Similar TV Shows */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <ContentRow
            title="More Like This"
            items={similar}
            type="tv"
            onItemClick={handleSimilarClick}
          />
        </div>
      )}
    </div>
  )
}
