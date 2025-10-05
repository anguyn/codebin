import { MainLayout } from '@/components/layouts/main-layout';
import { Badge } from '@/components/common/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Tag } from '@/types';
import { Hash, Code } from 'lucide-react';
import Link from 'next/link';

async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tags`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export const metadata = {
  title: 'Browse Tags',
  description: 'Explore code snippets by tags and topics',
};

export default async function TagsPage({
  params,
}: {
  params: Promise<{
    locale: string;
    searchParams: { type?: string };
  }>;
}) {
  const { locale, searchParams } = await params;
  const allTags = await getTags();
  const topicTags = allTags.filter(t => t.type === 'TOPIC');
  const languageTags = allTags.filter(t => t.type === 'LANGUAGE');

  const displayTags =
    searchParams.type === 'language' ? languageTags : topicTags;
  const title = searchParams.type === 'language' ? 'Languages' : 'Topics';

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Browse by Tags</h1>
            <p className="text-lg text-[var(--color-muted-foreground)]">
              Discover code snippets organized by programming languages and
              topics
            </p>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-[var(--color-border)]">
              <Link
                href={`/${locale}/tags`}
                className={`border-b-2 px-4 py-2 transition-colors ${
                  !searchParams.type || searchParams.type === 'topic'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                Topics ({topicTags.length})
              </Link>
              <Link
                href={`/${locale}/tags?type=language`}
                className={`border-b-2 px-4 py-2 transition-colors ${
                  searchParams.type === 'language'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                Languages ({languageTags.length})
              </Link>
            </div>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayTags.map(tag => (
              <Link key={tag.id} href={`/${locale}/tags/${tag.slug}`}>
                <Card className="h-full cursor-pointer pt-6 transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                        {tag.type === 'LANGUAGE' ? (
                          <Code className="h-5 w-5 text-[var(--color-primary)]" />
                        ) : (
                          <Hash className="h-5 w-5 text-[var(--color-primary)]" />
                        )}
                      </div>
                      <Badge variant="secondary">
                        {tag._count?.snippets || 0}
                      </Badge>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">{tag.name}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {tag._count?.snippets || 0} snippet
                      {tag._count?.snippets !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {displayTags.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">
                  No {title.toLowerCase()} found
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
