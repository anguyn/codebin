import { cookies } from 'next/headers';
import { formatCookies, serverFetch } from '@/lib/utils';
import { MainLayout } from '@/components/layouts/main-layout';
import { Snippet } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SnippetViewBlock } from '@/components/blocks/pages/snippets/view/render';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const cookieHeader = formatCookies(cookieStore.getAll());

  const snippet = await getSnippet(slug, cookieHeader);

  if (!snippet) {
    return {
      title: 'Snippet Not Found',
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

  const cookieStore = await cookies();
  const cookieHeader = formatCookies(cookieStore.getAll());

  const snippet = await getSnippet(slug, cookieHeader);

  if (!snippet) {
    notFound();
  }

  return (
    <MainLayout locale={locale}>
      <SnippetViewBlock snippet={snippet} locale={locale} />
    </MainLayout>
  );
}
