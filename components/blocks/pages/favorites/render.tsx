'use client';

import { SnippetCard } from '@/components/blocks/snippet-card';
import { Card, CardContent } from '@/components/common/card';
import { Snippet } from '@/types';
import { Heart } from 'lucide-react';

interface FavoritesTranslations {
  title: string;
  savedSnippet: string;
  pluralSuffix: string;
  noFavoritesYet: string;
  noFavoritesDescription: string;
}

interface FavoritesRenderBlockProps {
  favorites: Snippet[];
  translations: FavoritesTranslations;
  locale: string;
}

export function FavoritesRenderBlock({
  favorites,
  translations,
  locale,
}: FavoritesRenderBlockProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <Heart className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{translations.title}</h1>
            <p className="mt-1 text-[var(--color-muted-foreground)]">
              {favorites.length} {translations.savedSnippet}
              {favorites.length !== 1 ? translations.pluralSuffix : ''}
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(snippet => (
              <SnippetCard key={snippet.id} snippet={snippet} locale={locale} />
            ))}
          </div>
        ) : (
          <Card className="pt-6">
            <CardContent className="p-12 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]" />
              <p className="mb-2 text-lg text-[var(--color-muted-foreground)]">
                {translations.noFavoritesYet}
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {translations.noFavoritesDescription}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
