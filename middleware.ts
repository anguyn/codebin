import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { auth } from '@/lib/server/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // only treat the first segment as locale if it is 'en' or 'vi'
  const localeMatch = pathname.match(/^\/(en|vi)(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'en';

  const session = await auth();

  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-email',
  ];
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/snippets/new',
  ];

  // remove leading /en or /vi if present so we can check route matching reliably
  const basePath = pathname.replace(/^\/(en|vi)/, '');

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => basePath.startsWith(route)) && session) {
    return NextResponse.redirect(new URL(`/${locale}`, request.nextUrl.origin));
  }

  // Redirect unauthenticated users away from protected pages
  if (protectedRoutes.some(route => basePath.startsWith(route)) && !session) {
    const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin);
    // use the raw pathname (includes locale if present) as callback
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const referer = request.headers.get('referer');
  const isDirectAccess = !referer || !referer.includes(request.nextUrl.origin);

  if ((pathname === '/en' || pathname === '/vi') && isDirectAccess) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|vi)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
