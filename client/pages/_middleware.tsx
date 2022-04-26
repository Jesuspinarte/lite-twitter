import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import CreateClient from '../utils/CreateClient';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const client = CreateClient(req?.headers?.get('cookie'));
  const url = req.nextUrl.clone();
  const isUserInSession = !!req.cookies.lt_session;

  if (url.pathname === '/login' && isUserInSession) {
    return NextResponse.redirect(new URL('/', url));
  }

  if (url.pathname !== '/login' && !isUserInSession) {
    return NextResponse.redirect(new URL('/login', url));
  }

  return NextResponse.next();
}
