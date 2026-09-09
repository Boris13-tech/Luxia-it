import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  if (url.hostname === 'www.luxia-it.com') {
    url.hostname = 'luxia-it.com';
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: '/:path*' };
