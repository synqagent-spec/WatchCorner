// Uses TMDB IDs throughout - API routes proxy to 2embed.cc

export interface MediaItem {
  id: number
  tmdb_id?: number
  imdb_id?: string
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  overview: string
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
}

export interface MediaDetail {
  id: number
  tmdb_id?: number
  imdb_id?: string
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  genres: { id: number; name: string }[]
  runtime?: number
  tagline?: string
  release_date?: string
  first_air_date?: string
  number_of_seasons?: number
  cast?: {
    name: string
    character: string
    profile_path: string | null
  }[]
}

export interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
}

export interface ApiResponse<T> {
  results: T[]
  total_pages: number
  page: number
}

// Helper to get the TMDB ID from an item
export const getTmdbId = (item: MediaItem | MediaDetail): number => {
  return item.tmdb_id || item.id
}

// Trending endpoints (via local API routes to avoid CORS)
export const fetchTrendingMovies = async (timeWindow: string = 'day', page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/trending?time_window=${timeWindow}&page=${page}&type=movie`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

export const fetchTrendingTV = async (timeWindow: string = 'week', page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/trending?time_window=${timeWindow}&page=${page}&type=tv`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

// Search endpoints
export const searchMovies = async (query: string, page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&type=movie`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

export const searchTV = async (query: string, page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&type=tv`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

// Detail endpoints
export const fetchMovieDetail = async (tmdbId: string | number): Promise<MediaDetail> => {
  const res = await fetch(`/api/details?id=${tmdbId}&type=movie`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

export const fetchTVDetail = async (tmdbId: string | number): Promise<MediaDetail> => {
  const res = await fetch(`/api/details?id=${tmdbId}&type=tv`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

// Similar endpoints
export const fetchSimilarMovies = async (tmdbId: string | number, page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/similar?id=${tmdbId}&page=${page}&type=movie`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

export const fetchSimilarTV = async (tmdbId: string | number, page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const res = await fetch(`/api/similar?id=${tmdbId}&page=${page}&type=tv`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

// Season detail
export const fetchSeasonDetail = async (tmdbId: string | number, season: number): Promise<{ episodes: Episode[] }> => {
  const res = await fetch(`/api/season?id=${tmdbId}&season=${season}`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

// Genre map
export const genres: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
}
