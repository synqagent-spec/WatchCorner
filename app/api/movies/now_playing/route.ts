import { NextResponse } from 'next/server'
import { getNowPlaying } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getNowPlaying()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
