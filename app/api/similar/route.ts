import { NextRequest, NextResponse } from 'next/server'
import { getSimilar } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const page = searchParams.get('page') || '1'
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie'

  if (!id) {
    return NextResponse.json({ results: [], total_pages: 0, page: 1 })
  }

  try {
    const data = await getSimilar(type, parseInt(id))
    
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: parseInt(page),
    })
  } catch (error) {
    console.error('[v0] Similar API error:', error)
    return NextResponse.json({ results: [], total_pages: 0, page: 1 }, { status: 500 })
  }
}
