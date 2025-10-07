import { MainLayout } from '@/components/layouts/main-layout';
import {
  getTranslate,
  setStaticParamsLocale,
  getStaticParams,
} from '@/i18n/server';
import { PageProps } from '@/types/global';
import { Metadata } from 'next';
import { TagDetailRenderBlock } from '@/components/blocks/pages/tags/detail/render';
import { Tag, Snippet } from '@/types';
import { notFound } from 'next/navigation';
import { LocaleProps } from '@/i18n/config';

export const generateStaticParams = getStaticParams;

async function getTag(slug: string): Promise<Tag | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tags`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const tags: Tag[] = await res.json();
    return tags.find(t => t.slug === slug) || null;
  } catch (error) {
    console.error('Failed to fetch tag:', error);
    return null;
  }
}

async function getSnippetsByTag(tagSlug: string): Promise<Snippet[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?tag=${tagSlug}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.snippets || [];
  } catch (error) {
    console.error('Failed to fetch snippets by tag:', error);
    return [];
  }
}

interface TagDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tag = await getTag(slug);

  setStaticParamsLocale(locale as LocaleProps);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  if (!tag) {
    return {
      title: t.tags.notFound || 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} - ${t.tags.browseSnippets || 'Browse Snippets'}`,
    description: `${t.tags.explore || 'Explore'} ${tag._count?.snippets || 0} ${t.tags.codeSnippetsTagged || 'code snippets tagged with'} ${tag.name}`,
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { locale, slug } = await params;

  setStaticParamsLocale(locale as LocaleProps);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const [tag, snippets] = await Promise.all([
    getTag(slug),
    getSnippetsByTag(slug),
  ]);

  if (!tag) {
    notFound();
  }

  const tagDetailTranslations = {
    language: t.tags.language || 'Language',
    topic: t.tags.topic || 'Topic',
    snippet: t.tags.snippet || 'snippet',
    snippets: t.tags.snippets || 'snippets',
    found: t.tags.found || 'found',
    noSnippetsFound:
      t.tags.noSnippetsFound || 'No snippets found for this tag yet.',
  };

  return (
    <MainLayout locale={locale as string}>
      <TagDetailRenderBlock
        locale={locale as string}
        translations={tagDetailTranslations}
        tag={tag}
        snippets={snippets}
      />
    </MainLayout>
  );
}
