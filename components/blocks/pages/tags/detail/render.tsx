'use client';

import { Sidebar } from '@/components/layouts/sidebar';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { Badge } from '@/components/common/badge';
import { Tag, Snippet } from '@/types';
import { Hash, Code } from 'lucide-react';

interface TagDetailTranslations {
  language: string;
  topic: string;
  snippet: string;
  snippets: string;
  found: string;
  noSnippetsFound: string;
}

interface TagDetailRenderBlockProps {
  locale: string;
  translations: TagDetailTranslations;
  tag: Tag;
  snippets: Snippet[];
}

export function TagDetailRenderBlock({
  locale,
  translations,
  tag,
  snippets,
}: TagDetailRenderBlockProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <Sidebar locale={locale} />

        <div className="flex-1 space-y-6">
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
                    {tag.type === 'LANGUAGE'
                      ? translations.language
                      : translations.topic}
                  </Badge>
                </div>
                <p className="mt-1 text-[var(--color-muted-foreground)]">
                  {snippets.length}{' '}
                  {snippets.length !== 1
                    ? translations.snippets
                    : translations.snippet}{' '}
                  {translations.found}
                </p>
              </div>
            </div>
          </div>

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
                {translations.noSnippetsFound}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
