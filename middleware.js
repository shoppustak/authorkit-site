export function middleware(request) {
  const hostname = request.headers.get('host');

  // Handle bookshelf subdomain
  if (hostname === 'bookshelf.authorkit.pro') {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Route to bookshelf pages
    if (pathname === '/') {
      url.pathname = '/pages/bookshelf/index.html';
    } else if (pathname === '/browse') {
      url.pathname = '/pages/bookshelf/browse.html';
    } else if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/images/') || pathname.startsWith('/api/')) {
      // Allow static assets and API calls to pass through
      return;
    } else {
      url.pathname = `/pages/bookshelf${pathname}`;
    }

    return Response.redirect(url);
  }

  // Default: pass through
  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
