'use client';

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
import { Eye, Heart, Calendar, Code, User, Edit } from 'lucide-react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useCurrentUser } from '@/lib/hooks/use-current-user';
import { DeleteSnippetDialog } from '@/components/blocks/delete-snippet-dialog';

interface SnippetViewBlockProps {
  snippet: Snippet;
  locale: string;
}

export function SnippetViewBlock({ snippet, locale }: SnippetViewBlockProps) {
  const languageColor = getLanguageColor(snippet.language.name);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/snippets/${snippet.slug}`;
  const { user } = useCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto space-y-6">
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
              {user?.id == snippet.user.id && (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/snippets/${snippet.slug}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteSnippetDialog
                    snippetId={snippet.id}
                    snippetTitle={snippet.title}
                    locale={locale}
                    onClose={() => {}}
                  />
                </>
              )}
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
              {snippet.language.name}
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
                language={snippet.language.name}
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
                  This is an automated analysis. The actual complexity may vary
                  based on implementation details.
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
  );
}
