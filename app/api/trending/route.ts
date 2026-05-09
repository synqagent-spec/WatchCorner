import { NextRequest, NextResponse } from 'next/server'
import { getTrending } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeWindow = (searchParams.get('time_window') as 'day' | 'week') || 'day'
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie'
  const page = searchParams.get('page') || '1'

  try {
    const data = await getTrending(type, timeWindow)
    
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: parseInt(page),
    })
  } catch (error) {
    console.error('[v0] Trending API error:', error)
    return NextResponse.json(
      {
        results: [],
        total_pages: 0,
        page: parseInt(page),
        error: 'Failed to fetch trending data'
      },
      { status: 500 }
    )
  }
}
