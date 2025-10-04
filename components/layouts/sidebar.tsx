'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/common/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Tag as TagType } from '@/types';
import { Hash, TrendingUp, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const [languages, setLanguages] = useState<TagType[]>([]);
  const [topics, setTopics] = useState<TagType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [languagesRes, topicsRes] = await Promise.all([
          fetch('/api/tags?type=language'),
          fetch('/api/tags?type=topic'),
        ]);

        if (languagesRes.ok && topicsRes.ok) {
          const languagesData = await languagesRes.json();
          const topicsData = await topicsRes.json();
          setLanguages(languagesData.slice(0, 10));
          setTopics(topicsData.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <aside className="w-full space-y-4 lg:w-64">
        <Card>
          <CardHeader>
            <div className="h-5 animate-pulse rounded bg-[var(--color-secondary)]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded bg-[var(--color-secondary)]"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="w-full space-y-4 lg:w-64">
      {/* Popular Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Code className="h-4 w-4" />
            Popular Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {languages.map(lang => {
              const isActive = pathname.includes(`/tags/${lang.slug}`);
              return (
                <Link
                  key={lang.id}
                  href={`/${locale}/tags/${lang.slug}`}
                  className={cn(
                    'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                      : 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
                  )}
                >
                  <span>{lang.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {lang._count?.snippets || 0}
                  </Badge>
                </Link>
              );
            })}
          </div>
          <Link
            href={`/${locale}/tags?type=language`}
            className="mt-3 block text-sm text-[var(--color-primary)] hover:underline"
          >
            View all languages →
          </Link>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topics.map(topic => {
              const isActive = pathname.includes(`/tags/${topic.slug}`);
              return (
                <Link
                  key={topic.id}
                  href={`/${locale}/tags/${topic.slug}`}
                  className={cn(
                    'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                      : 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    {topic.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {topic._count?.snippets || 0}
                  </Badge>
                </Link>
              );
            })}
          </div>
          <Link
            href={`/${locale}/tags?type=topic`}
            className="mt-3 block text-sm text-[var(--color-primary)] hover:underline"
          >
            View all topics →
          </Link>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Total Snippets
            </span>
            <span className="font-semibold">1,234</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Developers
            </span>
            <span className="font-semibold">567</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Languages
            </span>
            <span className="font-semibold">{languages.length}+</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
