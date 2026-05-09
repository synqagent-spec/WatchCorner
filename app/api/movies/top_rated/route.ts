import { NextResponse } from 'next/server'
import { getTopRated } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getTopRated('movie')
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: data.page || 1,
    })
  } catch (error) {
    console.error('[WatchCorner][ROUTE_TOP_RATED_FAILED]', error)
    return NextResponse.json({ results: [], total_pages: 0, page: 1 }, { status: 500 })
  }
}
