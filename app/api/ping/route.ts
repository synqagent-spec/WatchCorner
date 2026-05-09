import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const keyStatus = !key
    ? 'MISSING'
    : key === 'your_tmdb_api_key_here'
    ? 'PLACEHOLDER'
    : 'OK'

  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: {
      tmdb_key: keyStatus,
      node_env: process.env.NODE_ENV,
    },
  })
}
