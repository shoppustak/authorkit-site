export default function middleware(req) {
  const url = new URL(req.url);
  const hostname = req.headers.get('host');

  if (hostname === 'bookshelf.bookpeek.club') {
    // Serve bookshelf HTML based on path
    if (url.pathname === '/') {
      return fetch(new URL('/bookshelf-index.html', url.origin));
    } else if (url.pathname === '/browse') {
      return fetch(new URL('/bookshelf-browse.html', url.origin));
    }
  }

  return;
}
