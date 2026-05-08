// ─── TMDB API ─────────────────────────────────────────────────

const TMDB_BASE = "https://api.themoviedb.org/3"
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(\`\${TMDB_BASE}\${path}\`)
  url.searchParams.set("api_key", KEY!)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(\`TMDB \${res.status} on \${path}\`)
  return res.json()
}

// ─── Trending ─────────────────────────────────────────────────
export const getTrending = (type: "movie" | "tv", window: "day" | "week" = "week") =>
  tmdbFetch(\`/trending/\${type}/\${window}\`)

// ─── Lists ────────────────────────────────────────────────────
export const getPopular = (type: "movie" | "tv") =>
  tmdbFetch(\`/\${type}/popular\`)

export const getTopRated = (type: "movie" | "tv") =>
  tmdbFetch(\`/\${type}/top_rated\`)

export const getNowPlaying = () => tmdbFetch("/movie/now_playing")
export const getUpcoming = () => tmdbFetch("/movie/upcoming")
export const getOnTheAir = () => tmdbFetch("/tv/on_the_air")

// ─── Single Title ─────────────────────────────────────────────
// Returns details + credits + images + videos + recommendations in one request
export const getFullDetails = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}\`, {
    append_to_response: "credits,images,videos,recommendations,similar",
  })

export const getDetails = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}\`)

export const getCredits = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}/credits\`)

export const getVideos = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}/videos\`)

export const getImages = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}/images\`)

export const getSimilar = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}/similar\`)

export const getRecommendations = (type: "movie" | "tv", id: number) =>
  tmdbFetch(\`/\${type}/\${id}/recommendations\`)

// ─── TV Specific ──────────────────────────────────────────────
export const getSeasonDetails = (id: number, season: number) =>
  tmdbFetch(\`/tv/\${id}/season/\${season}\`)

// ─── Search ───────────────────────────────────────────────────
export const searchMulti = (query: string) =>
  tmdbFetch("/search/multi", { query })

export const searchMovies = (query: string) =>
  tmdbFetch("/search/movie", { query })

export const searchTV = (query: string) =>
  tmdbFetch("/search/tv", { query })

// ─── Genres ───────────────────────────────────────────────────
export const getGenres = (type: "movie" | "tv") =>
  tmdbFetch(\`/genre/\${type}/list\`)
