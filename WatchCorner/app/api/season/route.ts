import { NextRequest, NextResponse } from 'next/server'
import { getSeasonDetails } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const season = searchParams.get('season') || '1'

  if (!id) {
    return NextResponse.json({ episodes: [] }, { status: 400 })
  }

  try {
    const data = await getSeasonDetails(parseInt(id), parseInt(season))
    
    return NextResponse.json({
      episodes: data.episodes || [],
    })
  } catch (error) {
    console.error('[v0] Season API error:', error)
    return NextResponse.json({ episodes: [] }, { status: 500 })
  }
}
