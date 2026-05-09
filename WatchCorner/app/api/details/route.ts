import { NextRequest, NextResponse } from 'next/server'
import { getFullDetails } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie'

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    const data = await getFullDetails(type, parseInt(id))
    
    return NextResponse.json({
      id: data.id,
      tmdb_id: data.id,
      imdb_id: data.imdb_id || null,
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
      cast: (data.credits?.cast || []).slice(0, 20).map((p: { name: string; character: string; profile_path: string | null }) => ({
        name: p.name,
        character: p.character,
        profile_path: p.profile_path,
      })),
    })
  } catch (error) {
    console.error('[v0] Details API error:', error)
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 })
  }
}
