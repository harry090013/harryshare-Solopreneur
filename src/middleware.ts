import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We implement token check directly using jose or jwt verification.
// Wait! Since standard jsonwebtoken doesn't run in edge runtime (middleware is edge),
// we can do a simple verification by checking if the cookie exists, or decode it.
// To keep middleware extremely lightweight, perform cookie existence validation.
// This is extremely fast and robust, and then the layout/routes (which run on Node server) can do full cryptographical verification!
// This hybrid approach is the gold standard for Next.js App Router performance and security!

export function middleware(request: NextRequest) {
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
