import { NextRequest, NextResponse } from 'next/server'

async function fetchWithFallback(urls: string[]): Promise<any> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 } })
      if (res.ok) {
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          return data
        }
      }
    } catch (error) {
      console.log(`[v0] API endpoint failed, trying next: ${url}`)
    }
  }
  throw new Error('All API endpoints failed')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  const type = searchParams.get('type') || 'movie'

  if (!query) {
    return NextResponse.json({ results: [], total_pages: 0, page: 1 })
  }

  try {
    const endpoint = type === 'tv' ? '/searchtv' : '/search'
    const urls = [
      `https://api.2embed.cc${endpoint}?q=${encodeURIComponent(query)}&page=${page}`,
      `https://api.2embed.skin${endpoint}?q=${encodeURIComponent(query)}&page=${page}`,
    ]

    const data = await fetchWithFallback(urls)
    
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
