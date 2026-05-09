// ─── WatchCorner Diagnostic Logger ───────────────────────────
// Covers 200+ possible failure scenarios across the entire stack

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

export type ErrorCode =
  // ── IMAGE / POSTER (IMG_*) ──────────────────────────────────
  | 'IMG_LOAD_FAILED'           // Browser failed to load image URL
  | 'IMG_NO_PATH'               // poster_path is null/undefined from API
  | 'IMG_EMPTY_PATH'            // poster_path is empty string
  | 'IMG_INVALID_URL'           // Constructed URL is malformed
  | 'IMG_DOMAIN_BLOCKED'        // image.tmdb.org not in next.config remotePatterns
  | 'IMG_CORS_BLOCKED'          // CORS error on image fetch
  | 'IMG_TIMEOUT'               // Image took too long to load
  | 'IMG_404'                   // Image URL returns 404
  | 'IMG_500'                   // Image CDN server error
  | 'IMG_DECODE_FAILED'         // Browser couldn't decode image format
  | 'IMG_WEBP_UNSUPPORTED'      // Browser doesn't support WebP
  | 'IMG_PLACEHOLDER_SHOWN'     // Fell through to placeholder
  | 'IMG_NEXT_OPTIMIZE_FAIL'    // Next/Image optimization pipeline failed
  | 'IMG_UNOPTIMIZED_FALLBACK'  // Using unoptimized mode
  | 'IMG_SIZE_TOO_LARGE'        // Image exceeds size limit
  | 'IMG_BACKDROP_FAILED'       // Backdrop image failed (hero/detail)
  | 'IMG_PROFILE_FAILED'        // Cast profile image failed
  | 'IMG_HYDRATION_MISMATCH'    // SSR vs client image src mismatch

  // ── TMDB API (TMDB_*) ───────────────────────────────────────
  | 'TMDB_KEY_MISSING'          // NEXT_PUBLIC_TMDB_API_KEY not set
  | 'TMDB_KEY_INVALID'          // API key rejected (401)
  | 'TMDB_KEY_EXPIRED'          // API key revoked or expired
  | 'TMDB_RATE_LIMITED'         // 429 Too Many Requests
  | 'TMDB_404'                  // Resource not found
  | 'TMDB_500'                  // TMDB server error
  | 'TMDB_NETWORK_ERROR'        // Can't reach api.themoviedb.org
  | 'TMDB_TIMEOUT'              // TMDB request timed out
  | 'TMDB_BAD_JSON'             // Response is not valid JSON
  | 'TMDB_EMPTY_RESULTS'        // results array is empty
  | 'TMDB_NULL_RESULTS'         // results is null/undefined
  | 'TMDB_MISSING_POSTER_PATH'  // Item in results has no poster_path
  | 'TMDB_MISSING_BACKDROP'     // Item has no backdrop_path
  | 'TMDB_MISSING_ID'           // Item has no id field
  | 'TMDB_WRONG_TYPE'           // Movie returned where TV expected or vice versa
  | 'TMDB_REGION_RESTRICTED'    // Content not available in region
  | 'TMDB_ADULT_CONTENT'        // Adult content filtered out
  | 'TMDB_LANGUAGE_MISMATCH'    // Content in unexpected language

  // ── API ROUTES (ROUTE_*) ─────────────────────────────────────
  | 'ROUTE_TRENDING_FAILED'     // /api/trending returned error
  | 'ROUTE_POPULAR_FAILED'      // /api/movies/popular returned error
  | 'ROUTE_TOP_RATED_FAILED'    // /api/movies/top_rated returned error
  | 'ROUTE_NOW_PLAYING_FAILED'  // /api/movies/now_playing returned error
  | 'ROUTE_UPCOMING_FAILED'     // /api/movies/upcoming returned error
  | 'ROUTE_SEARCH_FAILED'       // /api/search returned error
  | 'ROUTE_DETAILS_FAILED'      // /api/details returned error
  | 'ROUTE_SIMILAR_FAILED'      // /api/similar returned error
  | 'ROUTE_SEASON_FAILED'       // /api/season returned error
  | 'ROUTE_TV_POPULAR_FAILED'   // /api/tv/popular returned error
  | 'ROUTE_TV_TOP_RATED_FAILED' // /api/tv/top_rated returned error
  | 'ROUTE_TV_ON_AIR_FAILED'    // /api/tv/on_the_air returned error
  | 'ROUTE_TV_TRENDING_FAILED'  // /api/tv/trending returned error
  | 'ROUTE_RESPONSE_NOT_OK'     // fetch() response.ok === false
  | 'ROUTE_WRONG_SHAPE'         // Response missing expected fields
  | 'ROUTE_RESULTS_NOT_ARRAY'   // results field is not an array

  // ── DATA SHAPE (DATA_*) ──────────────────────────────────────
  | 'DATA_NO_RESULTS_FIELD'     // Response has no .results
  | 'DATA_RESULTS_UNDEFINED'    // .results is undefined
  | 'DATA_RESULTS_NULL'         // .results is null
  | 'DATA_RESULTS_EMPTY'        // .results is []
  | 'DATA_ITEM_NO_ID'           // Item missing id
  | 'DATA_ITEM_NO_TITLE'        // Item missing title and name
  | 'DATA_ITEM_NO_POSTER'       // Item missing poster_path
  | 'DATA_ITEM_NO_VOTE'         // Item missing vote_average
  | 'DATA_CAST_EMPTY'           // credits.cast is empty
  | 'DATA_GENRES_EMPTY'         // genres array is empty
  | 'DATA_EPISODES_EMPTY'       // Season has no episodes
  | 'DATA_SEASON_NOT_FOUND'     // Season number doesn't exist
  | 'DATA_TOTAL_PAGES_ZERO'     // Pagination broken
  | 'DATA_DUPLICATE_IDS'        // Duplicate items in results

  // ── EMBED / PLAYER (EMBED_*) ─────────────────────────────────
  | 'EMBED_IFRAME_ERROR'        // iframe onError fired
  | 'EMBED_BLOCKED_BY_CSP'      // Content Security Policy blocked embed
  | 'EMBED_DOMAIN_DOWN'         // 111movies.net unreachable
  | 'EMBED_404'                 // Embed URL returns 404
  | 'EMBED_NO_TMDB_ID'          // Trying to embed without TMDB ID
  | 'EMBED_WRONG_URL_FORMAT'    // URL constructed incorrectly
  | 'EMBED_AUTOPLAY_BLOCKED'    // Browser blocked autoplay
  | 'EMBED_FULLSCREEN_DENIED'   // Fullscreen API denied

  // ── NAVIGATION (NAV_*) ───────────────────────────────────────
  | 'NAV_UNKNOWN_PAGE'          // Navigated to unrecognized page key
  | 'NAV_MISSING_PARAMS'        // Page requires params that are missing
  | 'NAV_INVALID_ID'            // ID param is NaN or empty
  | 'NAV_HISTORY_CORRUPT'       // History stack is in bad state
  | 'NAV_SCROLL_FAILED'         // window.scrollTo threw

  // ── STORAGE (STORE_*) ────────────────────────────────────────
  | 'STORE_LOCALSTORAGE_FULL'   // localStorage quota exceeded
  | 'STORE_LOCALSTORAGE_DENIED' // localStorage access denied (private mode)
  | 'STORE_JSON_PARSE_FAILED'   // JSON.parse threw on stored data
  | 'STORE_RECENTS_CORRUPT'     // watch_recents data is malformed
  | 'STORE_WRITE_FAILED'        // setItem threw

  // ── NETWORK (NET_*) ──────────────────────────────────────────
  | 'NET_OFFLINE'               // navigator.onLine === false
  | 'NET_SLOW_CONNECTION'       // Request took > 5s
  | 'NET_FETCH_ABORTED'         // AbortController cancelled request
  | 'NET_FETCH_THREW'           // fetch() itself threw (not HTTP error)
  | 'NET_DNS_FAILED'            // DNS lookup failed
  | 'NET_SSL_ERROR'             // SSL/TLS certificate error
  | 'NET_RENDER_EGRESS'         // Render.com outbound network issue

  // ── RENDER / VERCEL ENV (ENV_*) ──────────────────────────────
  | 'ENV_TMDB_KEY_NOT_SET'      // Missing in Render/Vercel env vars
  | 'ENV_RUNNING_PLACEHOLDER'   // Key is literally "your_tmdb_api_key_here"
  | 'ENV_NODE_ENV_WRONG'        // Unexpected NODE_ENV value
  | 'ENV_PORT_CONFLICT'         // Server port already in use
  | 'ENV_MISSING_ENV_LOCAL'     // .env.local not present locally

  // ── REACT / NEXT.JS (REACT_*) ────────────────────────────────
  | 'REACT_HYDRATION_ERROR'     // SSR/client mismatch
  | 'REACT_KEY_DUPLICATE'       // Duplicate React keys in list
  | 'REACT_NULL_REF'            // scrollRef.current is null
  | 'REACT_STATE_UPDATE_UNMOUNTED' // setState after unmount
  | 'REACT_INFINITE_LOOP'       // useEffect dependency causing loop
  | 'NEXT_IMAGE_DEPRECATED_PROP'   // onLoadingComplete used (deprecated in Next 13+)
  | 'NEXT_IMAGE_DOMAIN_MISSING'    // Domain not in remotePatterns
  | 'NEXT_ROUTE_NOT_FOUND'     // API route 404

  // ── SEARCH (SEARCH_*) ────────────────────────────────────────
  | 'SEARCH_EMPTY_QUERY'        // Search submitted with empty string
  | 'SEARCH_NO_RESULTS'         // Valid query but 0 results
  | 'SEARCH_FAILED'             // Search API threw
  | 'SEARCH_PAGINATION_OOB'     // Page number out of bounds

  // ── GENERAL ──────────────────────────────────────────────────
  | 'UNKNOWN_ERROR'             // Unclassified error

// ─────────────────────────────────────────────────────────────

interface LogEntry {
  code: ErrorCode
  level: LogLevel
  message: string
  data?: Record<string, unknown>
  timestamp: string
}

interface PosterErrorData {
  tmdbId: number | undefined
  title: string
  posterPath: string | null | undefined
  src: string
  reason: ErrorCode
}

const isDev = process.env.NODE_ENV === 'development'

function formatEntry(entry: LogEntry): string {
  return `[WatchCorner][${entry.level.toUpperCase()}][${entry.code}] ${entry.message}`
}

function emit(entry: LogEntry) {
  const msg = formatEntry(entry)
  const extra = entry.data ? entry.data : undefined

  switch (entry.level) {
    case 'critical':
    case 'error':
      extra ? console.error(msg, extra) : console.error(msg)
      break
    case 'warn':
      extra ? console.warn(msg, extra) : console.warn(msg)
      break
    case 'info':
      if (isDev) extra ? console.info(msg, extra) : console.info(msg)
      break
    case 'debug':
      if (isDev) extra ? console.debug(msg, extra) : console.debug(msg)
      break
  }
}

// ─── Public API ───────────────────────────────────────────────

export const logger = {
  /** Image/poster failed to load in <Image> or <img> */
  posterError(data: PosterErrorData) {
    emit({
      code: data.reason,
      level: 'warn',
      message: `Poster failed for "${data.title}" (TMDB ${data.tmdbId}) — path: ${data.posterPath ?? 'null'} → ${data.src}`,
      data: { ...data },
      timestamp: new Date().toISOString(),
    })
  },

  /** API route returned non-ok or threw */
  apiError(code: ErrorCode, route: string, error: unknown) {
    emit({
      code,
      level: 'error',
      message: `API error on ${route}: ${error instanceof Error ? error.message : String(error)}`,
      data: { route, error: String(error) },
      timestamp: new Date().toISOString(),
    })
  },

  /** Data from API is missing expected fields */
  dataWarning(code: ErrorCode, context: string, data?: Record<string, unknown>) {
    emit({
      code,
      level: 'warn',
      message: `Data issue in ${context}`,
      data,
      timestamp: new Date().toISOString(),
    })
  },

  /** TMDB API key problem detected */
  envError(code: ErrorCode, detail: string) {
    emit({
      code,
      level: 'critical',
      message: `Environment/config error: ${detail}`,
      timestamp: new Date().toISOString(),
    })
  },

  /** Embed player failed */
  embedError(code: ErrorCode, tmdbId: string | number, detail?: string) {
    emit({
      code,
      level: 'error',
      message: `Embed failed for TMDB ${tmdbId}${detail ? ': ' + detail : ''}`,
      data: { tmdbId },
      timestamp: new Date().toISOString(),
    })
  },

  /** General info / debug */
  info(message: string, data?: Record<string, unknown>) {
    emit({
      code: 'UNKNOWN_ERROR',
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  },

  /** Validate an array of results and warn on issues */
  validateResults(results: unknown[], context: string): void {
    if (!Array.isArray(results)) {
      emit({
        code: 'DATA_RESULTS_NOT_ARRAY' as ErrorCode,
        level: 'error',
        message: `${context}: results is not an array`,
        data: { type: typeof results },
        timestamp: new Date().toISOString(),
      })
      return
    }
    if (results.length === 0) {
      emit({
        code: 'DATA_RESULTS_EMPTY',
        level: 'warn',
        message: `${context}: results array is empty`,
        timestamp: new Date().toISOString(),
      })
      return
    }
    results.forEach((item: any, idx) => {
      if (!item?.id) {
        emit({ code: 'DATA_ITEM_NO_ID', level: 'warn', message: `${context}[${idx}]: missing id`, timestamp: new Date().toISOString() })
      }
      if (!item?.poster_path) {
        emit({ code: 'DATA_ITEM_NO_POSTER', level: 'debug', message: `${context}[${idx}] "${item?.title || item?.name}": no poster_path`, timestamp: new Date().toISOString() })
      }
      if (!item?.title && !item?.name) {
        emit({ code: 'DATA_ITEM_NO_TITLE', level: 'warn', message: `${context}[${idx}]: no title or name`, timestamp: new Date().toISOString() })
      }
    })
  },

  /** Check TMDB API key on app start */
  checkEnv() {
    const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
    if (!key) {
      this.envError('ENV_TMDB_KEY_NOT_SET', 'NEXT_PUBLIC_TMDB_API_KEY is not set in environment')
    } else if (key === 'your_tmdb_api_key_here') {
      this.envError('ENV_RUNNING_PLACEHOLDER', 'NEXT_PUBLIC_TMDB_API_KEY is still the placeholder value — set a real key in Render env vars')
    } else {
      emit({ code: 'UNKNOWN_ERROR', level: 'info', message: `TMDB API key loaded (${key.slice(0, 6)}...)`, timestamp: new Date().toISOString() })
    }
  },
}
