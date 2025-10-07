import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { auth } from '@/lib/server/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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
    '/favorites',
  ];

  const basePath = pathname.replace(/^\/(en|vi)/, '');

  if (authRoutes.some(route => basePath.startsWith(route)) && session) {
    const callbackUrl = searchParams.get('callbackUrl');
    if (callbackUrl) {
      return NextResponse.redirect(
        new URL(callbackUrl, request.nextUrl.origin),
      );
    }
    return NextResponse.redirect(new URL(`/${locale}`, request.nextUrl.origin));
  }

  if (protectedRoutes.some(route => basePath.startsWith(route)) && !session) {
    const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|vi)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
