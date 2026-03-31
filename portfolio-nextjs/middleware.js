import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/pt');
  if (pathnameHasLocale) return NextResponse.next();

  const acceptLanguage = request.headers.get('accept-language') || '';
  const isPortuguese = acceptLanguage.toLowerCase().includes('pt');
  const locale = isPortuguese ? 'pt' : 'en';

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
