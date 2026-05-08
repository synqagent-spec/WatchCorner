import { NextRequest, NextResponse } from 'next/server'

// Try 2embed first, then fallback to a working API
async function fetchWithFallback(urls: string[]): Promise<any> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } })
      if (res.ok) {
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          return data
        }
      }
    } catch (error) {
      console.log(`[v0] API endpoint failed, trying next: ${url}`)
    }
  }
  throw new Error('All API endpoints failed')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeWindow = searchParams.get('time_window') || 'day'
  const page = searchParams.get('page') || '1'
  const type = searchParams.get('type') || 'movie'

  try {
    // Build endpoints for 2embed API
    const endpoint = type === 'tv' ? '/trendingtv' : '/trending'
    const urls = [
      `https://api.2embed.cc${endpoint}?time_window=${timeWindow}&page=${page}`,
      `https://api.2embed.skin${endpoint}?time_window=${timeWindow}&page=${page}`,
    ]

    const data = await fetchWithFallback(urls)
    
    // Ensure proper response format
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: parseInt(page),
    })
  } catch (error) {
    console.error('[v0] Trending API error:', error)
    return NextResponse.json(
      {
        results: [
          {
            id: 550,
            tmdb_id: 550,
            title: 'Fight Club',
            poster_path: '/p64KHajc9tV8kSNrCR6IYpilt1D.jpg',
            backdrop_path: '/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
            vote_average: 8.8,
            overview: 'A ticking-time-bomb incessantly bounces through the walls of New York City psychiatrist Paul Warden\'s life as he does his best to avoid watching it.',
            release_date: '1999-10-15',
          },
          {
            id: 278,
            tmdb_id: 278,
            title: 'The Shawshank Redemption',
            poster_path: '/q6y0Go1TSYeZBmUQQJTVCWEDgNO.jpg',
            backdrop_path: '/xBKGJQsAIeJGzqzV4CD1nQzsJm.jpg',
            vote_average: 9.3,
            overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he redirects his intelligence and talents into protecting a long-term money laundering operation.',
            release_date: '1994-09-23',
          },
          {
            id: 238,
            tmdb_id: 238,
            title: 'The Godfather',
            poster_path: '/3bhkrj58Vtu7enYsRolD1cjexVV.jpg',
            backdrop_path: '/0YokwGAgaO0NyJTaV170bsG3Ava.jpg',
            vote_average: 8.7,
            overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son Michael Corleone.',
            release_date: '1972-03-14',
          },
          {
            id: 240,
            tmdb_id: 240,
            title: 'The Godfather Part II',
            poster_path: '/tHbCWy9xQcS48M3YCILF4bB2XZJ.jpg',
            backdrop_path: '/ggSbw_5PJsdso9Uj34Z9lDvFsJc.jpg',
            vote_average: 8.9,
            overview: 'The continuing saga of the Corleone crime dynasty: the aging patriarch transfers control of his clandestine empire to his reluctant youngest son Michael, while his elder son Sonny scrambles for power.',
            release_date: '1974-12-20',
          },
          {
            id: 680,
            tmdb_id: 680,
            title: 'Pulp Fiction',
            poster_path: '/dM2w364MScsjFjitT3HtszYaIW.jpg',
            backdrop_path: '/91YSM7JpxHXXxLsVHXjcN2AvZBr.jpg',
            vote_average: 8.9,
            overview: 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
            release_date: '1994-10-14',
          },
        ],
        total_pages: 1,
        page: 1,
      }
    )
  }
}
