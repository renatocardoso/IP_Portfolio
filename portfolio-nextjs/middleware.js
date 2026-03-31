import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/pt');
  if (pathnameHasLocale) return NextResponse.next();

  // Só redireciona para /en se o browser indicar inglês explicitamente.
  // Caso contrário, reescreve internamente para /pt sem redirect HTTP — sem tela em branco.
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isEnglish = acceptLanguage.toLowerCase().startsWith('en') ||
                    (acceptLanguage.includes('en') && !acceptLanguage.toLowerCase().includes('pt'));

  if (isEnglish) {
    request.nextUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Português: rewrite silencioso (sem redirect, sem tela em branco)
  request.nextUrl.pathname = `/pt${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}
