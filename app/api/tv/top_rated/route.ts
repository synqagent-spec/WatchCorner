import { NextResponse } from 'next/server'
import { getTopRated } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getTopRated('tv')
    return NextResponse.json(data)
  } catch (error) {
    console.error('TV Top Rated API Error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
