// ─── EMBED CONFIGURATION ─────────────────────────────────────
// Change EMBED_BASE_URL if your server domain changes.
// Nothing else in this file should need editing.

export const EMBED_BASE_URL = "https://server-site.app";
export const API_BASE_URL = "https://api.2embed.cc";

// Movie player
export const getMovieEmbedUrl = (imdbId: string) =>
  `${EMBED_BASE_URL}/movie/${imdbId}`;

// TV player (with season + episode)
export const getTVEmbedUrl = (imdbId: string, season: number, episode: number) =>
  `${EMBED_BASE_URL}/tv/${imdbId}/${season}/${episode}`;

// Image base URLs for TMDB
export const IMG_BASE = "https://image.tmdb.org/t/p/";
export const posterUrl = (path: string) => `${IMG_BASE}w342${path}`;
export const backdropUrl = (path: string) => `${IMG_BASE}w1280${path}`;
export const profileUrl = (path: string) => `${IMG_BASE}w185${path}`;
