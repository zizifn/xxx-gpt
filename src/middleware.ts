import { NextRequest, NextResponse } from 'next/server'
import {userID} from './utils/openai'

// match all paths in next

export const config = {
    matcher: ['/', '/api/(.*)'],
  };
export function middleware(request: Request) {
    const basicAuth = request.headers.get('authorization')
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, password]: string[] = atob(authValue).split(':')
  
      if (user && user === userID) {
        return NextResponse.next()
      }
    }
    return new Response('Unauthorized', { status: 401, headers:{
      'WWW-Authenticate': 'Basic'
    } })
  }