import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Protect Admin dashboard routes
  if (pathname.startsWith('/quan-tri-harry')) {
    if (pathname === '/quan-tri-harry/login') {
      if (token) {
        // Already logged in, redirect to admin index
        return NextResponse.redirect(new URL('/quan-tri-harry', request.url));
      }
    } else {
      if (!token) {
        // Not logged in, redirect to login
        return NextResponse.redirect(new URL('/quan-tri-harry/login', request.url));
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: ['/quan-tri-harry/:path*'],
};
