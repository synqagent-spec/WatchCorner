'use client'

import { useEffect, useState } from 'react'
import { Film, Tv, ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieCard, MovieCardSkeleton } from '@/components/movie-card'
import { searchMovies, searchTV, getTmdbId, type MediaItem } from '@/lib/api'

interface SearchPageProps {
  query: string
  onNavigate: (page: string, params?: Record<string, string | number>) => void
}

export function SearchPage({ query, onNavigate }: SearchPageProps) {
  const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie')
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const search = async () => {
      setLoading(true)
      try {
        const data =
          searchType === 'movie'
            ? await searchMovies(query, page)
            : await searchTV(query, page)
        setResults(data.results || [])
        setTotalPages(Math.min(data.total_pages || 1, 10))
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    if (query) search()
  }, [query, searchType, page])

  const handleItemClick = (item: MediaItem) => {
    const title = item.title || item.name || 'Unknown'
    onNavigate(searchType, { id: getTmdbId(item), title })
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#E8F4FD]">
          Results for &quot;{query}&quot;
        </h1>

        {/* Type Toggle */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => {
              setSearchType('movie')
              setPage(1)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'movie'
                ? 'bg-[#89CFF0] text-[#04060f]'
                : 'bg-[#0d1526] text-[#E8F4FD] border border-[#89CFF0]/20 hover:border-[#89CFF0]/50'
            }`}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => {
              setSearchType('tv')
              setPage(1)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'tv'
                ? 'bg-[#89CFF0] text-[#04060f]'
                : 'bg-[#0d1526] text-[#E8F4FD] border border-[#89CFF0]/20 hover:border-[#89CFF0]/50'
            }`}
          >
            <Tv className="w-4 h-4" />
            TV Shows
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {results.map((item) => (
              <MovieCard
                key={getTmdbId(item)}
                item={item}
                type={searchType}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0d1526] border border-[#89CFF0]/20 text-[#E8F4FD] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#89CFF0]/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1
                  if (totalPages > 5) {
                    if (page > 3) pageNum = page - 2 + i
                    if (page > totalPages - 2) pageNum = totalPages - 4 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-mono transition-all ${
                        page === pageNum
                          ? 'bg-[#89CFF0] text-[#04060f]'
                          : 'bg-[#0d1526] text-[#E8F4FD] border border-[#89CFF0]/20 hover:border-[#89CFF0]/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0d1526] border border-[#89CFF0]/20 text-[#E8F4FD] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#89CFF0]/50 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#0d1526] flex items-center justify-center">
            <Film className="w-12 h-12 text-[#6BAED4]" />
          </div>
          <h2 className="font-serif text-2xl text-[#E8F4FD] mb-2">
            No results found
          </h2>
          <p className="text-[#6BAED4]">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  )
}
