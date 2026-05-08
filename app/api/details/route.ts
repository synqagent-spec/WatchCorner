import { NextRequest, NextResponse } from 'next/server'

async function fetchWithFallback(urls: string[]): Promise<any> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data = await res.json()
        return data
      }
    } catch (error) {
      console.log(`[v0] API endpoint failed, trying next: ${url}`)
    }
  }
  throw new Error('All API endpoints failed')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const type = searchParams.get('type') || 'movie'

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    const endpoint = type === 'tv' ? '/tv' : '/movie'
    const urls = [
      `https://api.2embed.cc${endpoint}?tmdb_id=${id}`,
      `https://api.2embed.skin${endpoint}?tmdb_id=${id}`,
    ]

    const data = await fetchWithFallback(urls)
    
    return NextResponse.json({
      id: data.id || parseInt(id as string),
      tmdb_id: data.tmdb_id || parseInt(id as string),
      title: data.title || data.name,
      name: data.name || data.title,
      overview: data.overview || '',
      poster_path: data.poster_path || null,
      backdrop_path: data.backdrop_path || null,
      vote_average: data.vote_average || 0,
      genres: data.genres || [],
      runtime: data.runtime,
      tagline: data.tagline,
      release_date: data.release_date,
      first_air_date: data.first_air_date,
      number_of_seasons: data.number_of_seasons,
      cast: data.cast || [],
    })
  } catch (error) {
    console.error('[v0] Details API error:', error)
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 })
  }
}
