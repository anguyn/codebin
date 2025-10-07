'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Code2, Zap, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks/use-current-user';

interface HomeTranslations {
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  createSnippet: string;
  exploreSnippets: string;
  instantAnalysisTitle: string;
  instantAnalysisDesc: string;
  communityDrivenTitle: string;
  communityDrivenDesc: string;
  ctaTitle: string;
  ctaDescription: string;
  getStartedFree: string;
}

interface HomeRenderBlockProps {
  locale: string;
  translations: HomeTranslations;
}

export function HomeRenderBlock({
  locale,
  translations,
}: HomeRenderBlockProps) {
  const { user } = useCurrentUser();

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-background)] to-[var(--color-secondary)]/20">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-7xl space-y-6 text-center">
            <h1 className="text-4xl leading-snug font-bold tracking-tight md:text-6xl">
              {translations.heroTitle}
              <br />
              <span className="text-[var(--color-primary)]">
                {translations.heroTitleHighlight}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              {translations.heroDescription}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href={`/${locale}/snippets/new`}>
                  <Code2 className="h-5 w-5" />
                  {translations.createSnippet}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/snippets`}>
                  {translations.exploreSnippets}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <Zap className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <CardTitle className="text-lg">
                  {translations.instantAnalysisTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {translations.instantAnalysisDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <Users className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <CardTitle className="text-lg">
                  {translations.communityDrivenTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {translations.communityDrivenDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-4xl border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 pt-6">
          <CardContent className="space-y-4 p-12 text-center">
            <h2 className="text-3xl font-bold">{translations.ctaTitle}</h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              {translations.ctaDescription}
            </p>
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link
                  href={
                    user ? `/${locale}/snippets/new` : `/${locale}/register`
                  }
                >
                  {translations.getStartedFree}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
