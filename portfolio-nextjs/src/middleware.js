import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip static files, api, and admin routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a valid locale prefix
  const pathnameHasLocale =
    pathname === '/en' ||
    pathname.startsWith('/en/') ||
    pathname === '/pt' ||
    pathname.startsWith('/pt/');

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred language
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isEnglish =
    acceptLanguage.toLowerCase().startsWith('en') ||
    (acceptLanguage.includes('en') && !acceptLanguage.toLowerCase().includes('pt'));

  const locale = isEnglish ? 'en' : 'pt';

  // Construct redirect URL without trailing slash at the root
  const redirectPath = `/${locale}${pathname === '/' ? '' : pathname}`;
  const url = new URL(redirectPath, request.url);

  return NextResponse.redirect(url);
}

