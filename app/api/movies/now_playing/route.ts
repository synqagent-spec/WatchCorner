import { NextResponse } from 'next/server'
import { getNowPlaying } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getNowPlaying()
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: data.page || 1,
    })
  } catch (error) {
    console.error('[WatchCorner][ROUTE_NOW_PLAYING_FAILED]', error)
    return NextResponse.json({ results: [], total_pages: 0, page: 1 }, { status: 500 })
  }
}
