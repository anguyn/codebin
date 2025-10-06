import { cookies } from 'next/headers';
import { formatCookies, serverFetch } from '@/lib/utils';
import { MainLayout } from '@/components/layouts/main-layout';
import { Snippet } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SnippetViewBlock } from '@/components/blocks/pages/snippets/view/render';
import {
  getTranslate,
  setStaticParamsLocale,
  getStaticParams,
} from '@/i18n/server';
import { PageProps } from '@/types/global';
import { auth } from '@/lib/server/auth';

export const generateStaticParams = getStaticParams;

async function getSnippet(
  slug: string,
  cookieHeader: string,
): Promise<Snippet | null> {
  try {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets/${slug}`,
      cookieHeader,
      { cache: 'no-store' },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch snippet:', error);
    return null;
  }
}

async function checkIsFavorited(
  snippetId: string,
  cookieHeader: string,
): Promise<boolean> {
  try {
    const res = await serverFetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets/${snippetId}/favorite/check`,
      cookieHeader,
      { cache: 'no-store' },
    );

    if (!res.ok) return false;
    const data = await res.json();
    return data.isFavorited || false;
  } catch (error) {
    return false;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale, slug } = await props.params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const cookieStore = await cookies();
  const cookieHeader = formatCookies(cookieStore.getAll());

  const snippet = await getSnippet(slug || '', cookieHeader);

  if (!snippet) {
    return {
      title: t.snippets.notFound || 'Snippet Not Found',
    };
  }

  return {
    title: snippet.title,
    description:
      snippet.description ||
      `${snippet.language.name} code snippet by ${snippet.user.name}`,
    openGraph: {
      title: snippet.title,
      description: snippet.description || undefined,
      type: 'article',
      authors: [snippet.user.name || 'Anonymous'],
    },
  };
}

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const session = await auth();
  const cookieStore = await cookies();
  const cookieHeader = formatCookies(cookieStore.getAll());

  const snippet = await getSnippet(slug, cookieHeader);

  if (!snippet) {
    notFound();
  }

  const isFavorited = session
    ? await checkIsFavorited(snippet.id, cookieHeader)
    : false;

  const snippetTranslations = {
    share: t.common.share,
    save: t.common.save,
    saved: t.common.saved,
    edit: t.common.edit,
    delete: t.common.delete,
    views: t.common.views,
    saves: t.common.saves,
    code: t.common.code,
    timeComplexity: t.snippets.timeComplexity,
    estimatedComplexity: t.snippets.estimatedComplexity,
    complexityDisclaimer: t.snippets.complexityDisclaimer,
    aboutAuthor: t.snippets.aboutAuthor,
    viewProfile: t.snippets.viewProfile,
    loginToSave: t.snippets.loginToSave,
  };

  return (
    <MainLayout locale={locale}>
      <SnippetViewBlock
        snippet={snippet}
        locale={locale}
        isFavorited={isFavorited}
        translations={snippetTranslations}
      />
    </MainLayout>
  );
}
