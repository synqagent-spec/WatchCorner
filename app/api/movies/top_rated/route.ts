import { NextResponse } from 'next/server'
import { getTopRated } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getTopRated('movie')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
