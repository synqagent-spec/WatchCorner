import { NextResponse } from 'next/server'
import { getPopular } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getPopular('tv')
    return NextResponse.json(data)
  } catch (error) {
    console.error('TV Popular API Error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
