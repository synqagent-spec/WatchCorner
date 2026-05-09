import { NextResponse } from 'next/server'
import { getPopular } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getPopular('movie')
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
