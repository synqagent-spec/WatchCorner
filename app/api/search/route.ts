import { NextRequest, NextResponse } from 'next/server'
import { searchMovies, searchTV } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  const type = searchParams.get('type') || 'movie'

  if (!query) {
    return NextResponse.json({ results: [], total_pages: 0, page: 1 })
  }

  try {
    const data = type === 'tv' 
      ? await searchTV(query, page) 
      : await searchMovies(query, page)
    
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      page: parseInt(page),
    })
  } catch (error) {
    console.error('[v0] Search API error:', error)
    return NextResponse.json({ results: [], total_pages: 0, page: 1 }, { status: 500 })
  }
}
