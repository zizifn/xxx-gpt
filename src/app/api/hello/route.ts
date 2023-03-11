
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export async function GET(request: NextRequest) {
  return new Response('Hello, Next.js!')
}
