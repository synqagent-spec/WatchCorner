'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { ContentRow } from '@/components/content-row'
import { getTVEmbedUrl, posterUrl, profileUrl } from '@/lib/embed-config'
import {
  fetchTVDetail,
  fetchSimilarTV,
  fetchTrendingTV,
  fetchSeasonDetail,
  getTmdbId,
  type MediaDetail,
  type MediaItem,
  type Episode,
} from '@/lib/api'

interface WatchTVPageProps {
  tmdbId: string
  title: string
  season: number
  episode: number
  onNavigate: (page: string, params?: Record<string, string | number>) => void
  onBack: () => void
}

export function WatchTVPage({
  tmdbId,
  title,
  season,
  episode,
  onNavigate,
  onBack,
}: WatchTVPageProps) {
  const [show, setShow] = useState<MediaDetail | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [similar, setSimilar] = useState<MediaItem[]>([])
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [embedFallback, setEmbedFallback] = useState(false)

  const currentEpisode = episodes.find((ep) => ep.episode_number === episode)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tvData, seasonData, similarData, trendingData] =
          await Promise.all([
            fetchTVDetail(tmdbId),
            fetchSeasonDetail(tmdbId, season),
            fetchSimilarTV(tmdbId),
            fetchTrendingTV('day'),
          ])
        setShow(tvData)
        setEpisodes(seasonData.episodes || [])
        setSimilar(similarData.results || [])
        setTrending(trendingData.results || [])

        // Save to recents
        if (tvData) {
          const savedRecents = localStorage.getItem('watch_recents')
          let recents = savedRecents ? JSON.parse(savedRecents) : []
          // Remove if already exists
          recents = recents.filter((item: any) => (item.tmdb_id || item.id) !== tvData.id)
          // Add to front
          recents.unshift(tvData)
          // Keep only last 10
          localStorage.setItem('watch_recents', JSON.stringify(recents.slice(0, 10)))
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [tmdbId, season])

  const handleEpisodeChange = (newEpisode: number) => {
    onNavigate('watch-tv', {
      id: tmdbId,
      title,
      season,
      episode: newEpisode,
    })
  }

  const handleSimilarClick = (item: MediaItem) => {
    onNavigate('tv', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  const handleTrendingClick = (item: MediaItem) => {
    onNavigate('tv', {
      id: getTmdbId(item),
      title: item.title || item.name || 'Unknown',
    })
  }

  const hasPrevEpisode = episode > 1
  const hasNextEpisode = episode < episodes.length

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
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
                src={getTVEmbedUrl(tmdbId, season, episode)}
                title={`${title} S${season}E${episode}`}
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

            {/* Episode Navigation */}
            <div className="flex items-center justify-between mt-4 p-4 glass-card rounded-lg">
              <button
                onClick={() => handleEpisodeChange(episode - 1)}
                disabled={!hasPrevEpisode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1526] border border-[#89CFF0]/20 text-[#E8F4FD] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#89CFF0]/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="text-center">
                <span className="font-mono text-[#89CFF0]">
                  S{season} E{episode}
                </span>
                {currentEpisode && (
                  <p className="text-sm text-[#E8F4FD] mt-1">
                    {currentEpisode.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleEpisodeChange(episode + 1)}
                disabled={!hasNextEpisode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1526] border border-[#89CFF0]/20 text-[#E8F4FD] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#89CFF0]/50 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Show Info */}
            {show && (
              <div className="mt-6">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#E8F4FD]">
                  {show.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-[#89CFF0]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-mono">
                      {show.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[#6BAED4] text-sm font-mono">
                    Season {season} Episode {episode}
                  </span>
                </div>

                {show.genres && show.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {show.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 text-xs rounded-full bg-[#0d1526] text-[#89CFF0] border border-[#89CFF0]/20"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {currentEpisode?.overview && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-[#E8F4FD] mb-2">
                      Episode Overview
                    </h2>
                    <p className="text-[#E8F4FD]/80 leading-relaxed">
                      {currentEpisode.overview}
                    </p>
                  </div>
                )}

                {/* Cast */}
                {show.cast && show.cast.length > 0 && (
                  <div className="mt-8">
                    <h2 className="font-serif text-xl font-semibold text-[#E8F4FD] mb-4">
                      Cast
                    </h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                      {show.cast.slice(0, 8).map((person, idx) => (
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

            {/* Episodes List */}
            {episodes.length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-xl font-semibold text-[#E8F4FD] mb-4 crystal-underline inline-block">
                  All Episodes - Season {season}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {episodes.map((ep) => (
                    <button
                      key={ep.episode_number}
                      onClick={() => handleEpisodeChange(ep.episode_number)}
                      className={`flex gap-3 p-3 rounded-lg text-left transition-all ${
                        ep.episode_number === episode
                          ? 'bg-[#89CFF0]/20 border border-[#89CFF0]/50'
                          : 'glass-card hover:border-[#89CFF0]/40'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          ep.episode_number === episode
                            ? 'bg-[#89CFF0] text-[#04060f]'
                            : 'bg-[#89CFF0]/10 text-[#89CFF0]'
                        }`}
                      >
                        {ep.episode_number === episode ? (
                          <Play className="w-4 h-4 fill-current" />
                        ) : (
                          <span className="font-mono text-sm">
                            {ep.episode_number}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#E8F4FD] line-clamp-1">
                          {ep.name}
                        </h3>
                        {ep.air_date && (
                          <p className="text-xs text-[#6BAED4] mt-1">
                            {ep.air_date}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Similar TV Shows */}
            {similar.length > 0 && (
              <div className="mt-8">
                <ContentRow
                  title="More Like This"
                  items={similar}
                  type="tv"
                  onItemClick={handleSimilarClick}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Trending */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-[#E8F4FD] mb-4 crystal-underline inline-block">
                Trending TV
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
                            alt={item.title || item.name || 'TV Show'}
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
