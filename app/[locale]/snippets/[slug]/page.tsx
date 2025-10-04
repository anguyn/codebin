import { MainLayout } from '@/components/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { CopyButton } from '@/components/custom/copy-button';
import { Snippet } from '@/types';
import { formatDate, getLanguageColor } from '@/lib/utils';
import {
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  User,
  Calendar,
  Code,
} from 'lucide-react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getSnippet(slug: string): Promise<Snippet | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets/${slug}`,
      {
        cache: 'no-store',
      },
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
  const snippet = await getSnippet(slug);

  if (!snippet) {
    return {
      title: 'Snippet Not Found',
    };
  }

  return {
    title: snippet.title,
    description:
      snippet.description ||
      `${snippet.language} code snippet by ${snippet.user.name}`,
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
  const snippet = await getSnippet(slug);

  if (!snippet) {
    notFound();
  }

  const languageColor = getLanguageColor(snippet.language);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/snippets/${snippet.slug}`;

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold">{snippet.title}</h1>
                {snippet.description && (
                  <p className="text-[var(--color-muted-foreground)]">
                    {snippet.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <CopyButton text={shareUrl} label="Share" />
                <Button variant="outline" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <Link
                href={`/${locale}/users/${snippet.user.username}`}
                className="flex items-center gap-2 hover:text-[var(--color-foreground)]"
              >
                {snippet.user.image ? (
                  <img
                    src={snippet.user.image}
                    alt={snippet.user.name || 'User'}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="font-medium">
                  {snippet.user.name || snippet.user.username}
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(snippet.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {snippet.viewCount} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {snippet._count?.favorites || 0} saves
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge
                style={{
                  backgroundColor: `${languageColor}15`,
                  color: languageColor,
                  borderColor: languageColor,
                }}
                variant="outline"
              >
                {snippet.language}
              </Badge>
              {snippet.complexity && (
                <Badge variant="outline" className="gap-1">
                  <Code className="h-3 w-3" />
                  {snippet.complexity}
                </Badge>
              )}
              {snippet.tags.map(({ tag }) =>
                tag.type === 'TOPIC' ? (
                  <Link key={tag.id} href={`/${locale}/tags/${tag.slug}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-[var(--color-secondary)]/80"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ) : null,
              )}
            </div>
          </div>

          {/* Code Block */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Code</CardTitle>
              <CopyButton text={snippet.code} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="code-block">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                  }}
                  showLineNumbers
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          {/* Complexity Analysis */}
          {snippet.complexity && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  Time Complexity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                      {snippet.complexity}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">
                      Estimated time complexity
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    This is an automated analysis. The actual complexity may
                    vary based on implementation details.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Author Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {snippet.user.image ? (
                  <img
                    src={snippet.user.image}
                    alt={snippet.user.name || 'User'}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{snippet.user.name}</h3>
                  <p className="mb-3 text-sm text-[var(--color-muted-foreground)]">
                    @{snippet.user.username}
                  </p>
                  {snippet.user.bio && (
                    <p className="mb-3 text-sm text-[var(--color-muted-foreground)]">
                      {snippet.user.bio}
                    </p>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${locale}/users/${snippet.user.username}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
