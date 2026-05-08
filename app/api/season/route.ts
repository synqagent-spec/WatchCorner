import { NextRequest, NextResponse } from 'next/server'

async function fetchWithFallback(urls: string[]): Promise<any> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data = await res.json()
        return data
      }
    } catch (error) {
      console.log(`[v0] API endpoint failed, trying next: ${url}`)
    }
  }
  throw new Error('All API endpoints failed')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const season = searchParams.get('season') || '1'

  if (!id) {
    return NextResponse.json({ episodes: [] }, { status: 400 })
  }

  try {
    const urls = [
      `https://api.2embed.cc/season?tmdb_id=${id}&season=${season}`,
      `https://api.2embed.skin/season?tmdb_id=${id}&season=${season}`,
    ]

    const data = await fetchWithFallback(urls)
    
    return NextResponse.json({
      episodes: data.episodes || [],
    })
  } catch (error) {
    console.error('[v0] Season API error:', error)
    return NextResponse.json({ episodes: [] }, { status: 500 })
  }
}
