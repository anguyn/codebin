import { MainLayout } from '@/components/layouts/main-layout';
import { Sidebar } from '@/components/layouts/sidebar';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Snippet } from '@/types';
import {
  Code2,
  Zap,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

async function getRecentSnippets(): Promise<Snippet[]> {
  try {
    console.log("Log ra URL 1: ", `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?limit=6`)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?limit=6`,
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.snippets || [];
  } catch (error) {
    console.error('Failed to fetch snippets:', error);
    return [];
  }
}

async function getTrendingSnippets(): Promise<Snippet[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?limit=4`,
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.snippets || [];
  } catch (error) {
    return [];
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [recentSnippets, trendingSnippets] = await Promise.all([
    getRecentSnippets(),
    getTrendingSnippets(),
  ]);

  return (
    <MainLayout locale={locale}>
      <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-background)] to-[var(--color-secondary)]/20">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Share Code Snippets.
              <br />
              <span className="text-[var(--color-primary)]">
                Inspire The World
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Discover, share, and collaborate on code snippets with developers
              worldwide. Get instant complexity analysis and organize your code
              efficiently.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href={`/${locale}/snippets/new`}>
                  <Code2 className="h-5 w-5" />
                  Create Snippet
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/snippets`}>
                  Explore Snippets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <Zap className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <CardTitle className="text-lg">Instant Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Get automatic time complexity analysis for your code snippets
                  with AI-powered insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <Users className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <CardTitle className="text-lg">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Join thousands of developers sharing knowledge and best
                  practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <Shield className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <CardTitle className="text-lg">SEO Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Share your snippets with unique URLs optimized for search
                  engines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <Sidebar locale={locale} />

          {/* Content Area */}
          <div className="flex-1 space-y-12">
            {/* Trending Snippets */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-2xl font-bold">Trending Now</h2>
                </div>
                <Button variant="ghost" asChild>
                  <Link href={`/${locale}/snippets?sort=trending`}>
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {trendingSnippets.map(snippet => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    locale={locale}
                  />
                ))}
              </div>
            </div>

            {/* Recent Snippets */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-2xl font-bold">Recently Added</h2>
                </div>
                <Button variant="ghost" asChild>
                  <Link href={`/${locale}/snippets`}>
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recentSnippets.map(snippet => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    locale={locale}
                  />
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <Card className="border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5">
              <CardContent className="space-y-4 p-8 text-center">
                <h3 className="text-2xl font-bold">
                  Ready to share your code?
                </h3>
                <p className="mx-auto max-w-2xl text-[var(--color-muted-foreground)]">
                  Join our community and start sharing your code snippets today.
                  Get feedback, collaborate, and grow as a developer.
                </p>
                <Button size="lg" asChild>
                  <Link href={`/${locale}/auth/register`}>
                    Get Started Free
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
