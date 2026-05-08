// ─── EMBED CONFIGURATION ─────────────────────────────────────

const MOVIE_EMBED = "https://111movies.net/movie"
const TV_EMBED = "https://111movies.net/tv"

// Pass TMDB ID directly — 111Movies accepts numeric TMDB IDs
// To use IMDB ID instead, prefix with "tt" e.g. tt1234567
export const getMovieEmbedUrl = (tmdbId: string | number) => {
  return `${MOVIE_EMBED}/${tmdbId}`
}

export const getTVEmbedUrl = (tmdbId: string | number, season: number, episode: number) => {
  return `${TV_EMBED}/${tmdbId}/${season}/${episode}`
}

// ─── Image URLs ───────────────────────────────────────────────
const IMG_BASE = "https://image.tmdb.org/t/p/"

export const posterUrl = (path: string | null) =>
  path ? `${IMG_BASE}w342${path}` : "/placeholder-poster.jpg"

export const backdropUrl = (path: string | null) =>
  path ? `${IMG_BASE}w1280${path}` : "/placeholder-backdrop.jpg"

export const profileUrl = (path: string | null) =>
  path ? `${IMG_BASE}w185${path}` : "/placeholder-profile.jpg"
