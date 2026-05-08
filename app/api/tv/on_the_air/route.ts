import { NextResponse } from 'next/server'
import { getOnTheAir } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getOnTheAir()
    return NextResponse.json(data)
  } catch (error) {
    console.error('TV On The Air API Error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
