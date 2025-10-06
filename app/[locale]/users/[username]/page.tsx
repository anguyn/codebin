import { MainLayout } from '@/components/layouts/main-layout';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { User, Snippet } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Code2, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/server/auth';
import { Metadata } from 'next';

async function getUserProfile(username: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${username}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

async function getUserSnippets(username: string): Promise<Snippet[]> {
  try {
    const user = await getUserProfile(username);
    if (!user) return [];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?userId=${user.id}`,
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
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserProfile(username);

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.name || user.username} - Profile`,
    description:
      user.bio ||
      `View ${user.name || user.username}'s code snippets and profile`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{
    locale: string;
    username: string;
  }>;
}) {
  const { locale, username } = await params;
  const [user, snippets, session] = await Promise.all([
    getUserProfile(username),
    getUserSnippets(username),
    auth(),
  ]);

  if (!user) {
    notFound();
  }

  const isOwner = session?.user?.id === user.id;
  const publicSnippets = snippets.filter(s => s.isPublic);
  const displaySnippets = isOwner ? snippets : publicSnippets;

  const languageStats = displaySnippets.reduce(
    (acc, snippet) => {
      const lang = snippet.language.name;
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="pt-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="h-32 w-32 rounded-full border-4 border-[var(--color-border)] object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--color-border)] bg-[var(--color-secondary)]">
                      <Code2 className="h-16 w-16 text-[var(--color-muted-foreground)]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {user.name || user.username}
                      </h1>
                      <p className="mt-1 text-[var(--color-muted-foreground)]">
                        @{user.username}
                      </p>
                    </div>
                    {isOwner && (
                      <Button disabled variant="outline" size="sm" asChild>
                        <Link href={`/${locale}/settings`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </Button>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-[var(--color-foreground)]">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted-foreground)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Code2 className="h-4 w-4" />
                      {displaySnippets.length} snippet
                      {displaySnippets.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
                    <div className="rounded-lg bg-[var(--color-secondary)] p-3 text-center">
                      <div className="text-2xl font-bold">
                        {displaySnippets.length}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        Snippets
                      </div>
                    </div>
                    <div className="rounded-lg bg-[var(--color-secondary)] p-3 text-center">
                      <div className="text-2xl font-bold">
                        {displaySnippets.reduce(
                          (sum, s) => sum + s.viewCount,
                          0,
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        Views
                      </div>
                    </div>
                    <div className="rounded-lg bg-[var(--color-secondary)] p-3 text-center">
                      <div className="text-2xl font-bold">
                        {displaySnippets.reduce(
                          (sum, s) => sum + (s._count?.favorites || 0),
                          0,
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        Favorites
                      </div>
                    </div>
                    <div className="rounded-lg bg-[var(--color-secondary)] p-3 text-center">
                      <div className="text-2xl font-bold">
                        {topLanguages.length}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        Languages
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {topLanguages.length > 0 && (
            <Card className="pt-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Top Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {topLanguages.map(([lang, count]) => (
                    <Badge key={lang} variant="secondary">
                      {lang} ({count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {isOwner ? 'My Snippets' : 'Public Snippets'}
              </h2>
              {isOwner && (
                <Button asChild>
                  <Link href={`/${locale}/snippets/new`}>
                    <Code2 className="mr-2 h-4 w-4" />
                    Create New
                  </Link>
                </Button>
              )}
            </div>

            {displaySnippets.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displaySnippets.map(snippet => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Code2 className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]" />
                  <p className="text-[var(--color-muted-foreground)]">
                    {isOwner
                      ? "You haven't created any snippets yet"
                      : 'No public snippets available'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
