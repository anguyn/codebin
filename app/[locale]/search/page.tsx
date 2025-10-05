import { MainLayout } from '@/components/layouts/main-layout';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { Card, CardContent } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { Snippet, Tag, User } from '@/types';
import { Search, Code, Hash, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface SearchResults {
  snippets: Snippet[];
  tags: Tag[];
  users: User[];
}

async function searchAll(query: string): Promise<SearchResults> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/search?q=${encodeURIComponent(query)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      return { snippets: [], tags: [], users: [] };
    }
    return await res.json();
  } catch (error) {
    return { snippets: [], tags: [], users: [] };
  }
}

export const metadata = {
  title: 'Search',
  description: 'Search for code snippets, tags, and developers',
};

export default async function SearchPage({
  params,
}: {
  params: Promise<{
    locale: string;
    searchParams: { q?: string; type?: string };
  }>;
}) {
  const { locale, searchParams } = await params;
  const query = searchParams.q || '';
  const type = searchParams.type || 'all';

  const results = query
    ? await searchAll(query)
    : { snippets: [], tags: [], users: [] };

  console.log('Test nè:', results);

  // Đảm bảo các mảng luôn tồn tại
  const snippets = results?.snippets || [];
  const tags = results?.tags || [];
  const users = results?.users || [];

  const totalResults = snippets.length + tags.length + users.length;

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto space-y-8">
          {/* Search Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Search Results</h1>
            {query && (
              <p className="text-[var(--color-muted-foreground)]">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "
                <span className="font-semibold text-[var(--color-foreground)]">
                  {query}
                </span>
                "
              </p>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-border)]">
              <Link
                href={`/${locale}/search?q=${query}`}
                className={`border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                  type === 'all'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                All ({totalResults})
              </Link>
              <Link
                href={`/${locale}/search?q=${query}&type=snippets`}
                className={`border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                  type === 'snippets'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                Snippets ({snippets.length})
              </Link>
              <Link
                href={`/${locale}/search?q=${query}&type=tags`}
                className={`border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                  type === 'tags'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                Tags ({tags.length})
              </Link>
              <Link
                href={`/${locale}/search?q=${query}&type=users`}
                className={`border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                  type === 'users'
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                Users ({users.length})
              </Link>
            </div>
          </div>

          {!query ? (
            <Card className="pt-6">
              <CardContent className="p-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]" />
                <p className="text-[var(--color-muted-foreground)]">
                  Enter a search query to find snippets, tags, and users
                </p>
              </CardContent>
            </Card>
          ) : totalResults === 0 ? (
            <Card className="pt-6">
              <CardContent className="p-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]" />
                <p className="text-[var(--color-muted-foreground)]">
                  No results found for "{query}"
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Snippets */}
              {(type === 'all' || type === 'snippets') &&
                snippets.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <h2 className="text-2xl font-bold">Snippets</h2>
                      <Badge variant="secondary">{snippets.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {snippets.map(snippet => (
                        <SnippetCard
                          key={snippet.id}
                          snippet={snippet}
                          locale={locale}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Tags */}
              {(type === 'all' || type === 'tags') && tags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    <h2 className="text-2xl font-bold">Tags</h2>
                    <Badge variant="secondary">{tags.length}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {tags.map(tag => (
                      <Link key={tag.id} href={`/${locale}/tags/${tag.slug}`}>
                        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                          <CardContent className="p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Hash className="h-4 w-4 text-[var(--color-primary)]" />
                              <h3 className="truncate font-semibold">
                                {tag.name}
                              </h3>
                            </div>
                            <p className="text-xs text-[var(--color-muted-foreground)]">
                              {tag._count?.snippets || 0} snippets
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {(type === 'all' || type === 'users') && users.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    <h2 className="text-2xl font-bold">Users</h2>
                    <Badge variant="secondary">{users.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {users.map(user => (
                      <Link
                        key={user.id}
                        href={`/${locale}/users/${user.username}`}
                      >
                        <Card className="cursor-pointer pt-6 transition-shadow hover:shadow-lg">
                          <CardContent className="flex items-center gap-4 p-4">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || 'User'}
                                className="h-12 w-12 rounded-full"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                                <UserIcon className="h-6 w-6" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-semibold">
                                {user.name || user.username}
                              </h3>
                              <p className="truncate text-sm text-[var(--color-muted-foreground)]">
                                @{user.username}
                              </p>
                              {user.bio && (
                                <p className="mt-1 truncate text-xs text-[var(--color-muted-foreground)]">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {(user as any)._count?.snippets || 0}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
