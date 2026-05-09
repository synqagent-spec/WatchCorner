import { NextResponse } from 'next/server'
import { getTrending } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getTrending('tv', 'week')
    return NextResponse.json(data)
  } catch (error) {
    console.error('TV Trending API Error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
