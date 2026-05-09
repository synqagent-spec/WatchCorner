import { NextResponse } from 'next/server'
import { getPopular } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getPopular('movie')
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: data.page || 1,
    })
  } catch (error) {
    console.error('[WatchCorner][ROUTE_POPULAR_FAILED]', error)
    return NextResponse.json({ results: [], total_pages: 0, page: 1 }, { status: 500 })
  }
}
