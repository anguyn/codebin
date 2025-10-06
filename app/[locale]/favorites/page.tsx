import { cookies } from 'next/headers';
import { formatCookies, serverFetch } from '@/lib/utils';
import { MainLayout } from '@/components/layouts/main-layout';
import { Snippet } from '@/types';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/server/auth';
import {
  getTranslate,
  setStaticParamsLocale,
  getStaticParams,
} from '@/i18n/server';
import { PageProps } from '@/types/global';
import { Metadata } from 'next';
import { FavoritesBlock } from '@/components/blocks/pages/favorites/render';

export const generateStaticParams = getStaticParams;

async function getFavorites(
  userId: string,
  cookieHeader: string,
): Promise<Snippet[]> {
  try {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/me/favorites`,
      cookieHeader,
      { cache: 'no-store' },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.favorites || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  return {
    title: t.favorites.title || 'My Favorites',
    description: t.favorites.pageDescription || 'Your saved code snippets',
    keywords: 'favorites, saved snippets, bookmarks',
  };
}

export default async function FavoritesPage(props: PageProps) {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const session = await auth();

  if (!session) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/favorites`);
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = formatCookies(allCookies);

  const favorites = await getFavorites(session.user.id, cookieHeader);

  const favoritesTranslations = {
    title: t.favorites.title,
    savedSnippet: t.favorites.savedSnippet,
    pluralSuffix: t.favorites.pluralSuffix,
    noFavoritesYet: t.favorites.noFavoritesYet,
    noFavoritesDescription: t.favorites.noFavoritesDescription,
  };

  return (
    <MainLayout locale={locale as string}>
      <FavoritesBlock
        favorites={favorites}
        translations={favoritesTranslations}
        locale={locale as string}
      />
    </MainLayout>
  );
}
