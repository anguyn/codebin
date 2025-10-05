import { MainLayout } from '@/components/layouts/main-layout';
import { Sidebar } from '@/components/layouts/sidebar';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { Badge } from '@/components/common/badge';
import { Tag, Snippet } from '@/types';
import { Hash, Code } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getTag(slug: string): Promise<Tag | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tags`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const tags: Tag[] = await res.json();
    return tags.find(t => t.slug === slug) || null;
  } catch (error) {
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
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} - Browse Snippets`,
    description: `Explore ${tag._count?.snippets || 0} code snippets tagged with ${tag.name}`,
  };
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  const [tag, snippets] = await Promise.all([
    getTag(slug),
    getSnippetsByTag(slug),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <Sidebar locale={locale} />

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Tag Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                  {tag.type === 'LANGUAGE' ? (
                    <Code className="h-8 w-8 text-[var(--color-primary)]" />
                  ) : (
                    <Hash className="h-8 w-8 text-[var(--color-primary)]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{tag.name}</h1>
                    <Badge variant="secondary">
                      {tag.type === 'LANGUAGE' ? 'Language' : 'Topic'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[var(--color-muted-foreground)]">
                    {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}{' '}
                    found
                  </p>
                </div>
              </div>
            </div>

            {/* Snippets Grid */}
            {snippets.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {snippets.map(snippet => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--color-border)] py-12 text-center">
                <p className="text-lg text-[var(--color-muted-foreground)]">
                  No snippets found for this tag yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
