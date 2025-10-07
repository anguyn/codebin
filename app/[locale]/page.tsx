import { MainLayout } from '@/components/layouts/main-layout';
import {
  getTranslate,
  setStaticParamsLocale,
  getStaticParams,
} from '@/i18n/server';
import { PageProps } from '@/types/global';
import { Metadata } from 'next';
import { HomeRenderBlock } from '@/components/blocks/pages/home/render';

export const generateStaticParams = getStaticParams;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  return {
    title: t.home.title || 'Share Code Snippets',
    description:
      t.home.pageDescription ||
      'Discover, share, and collaborate on code snippets with developers worldwide',
    keywords: 'code snippets, programming, collaboration, developer community',
  };
}

export default async function HomePage(props: PageProps) {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const homeTranslations = {
    heroTitle: t.home.heroTitle,
    heroTitleHighlight: t.home.heroTitleHighlight,
    heroDescription: t.home.heroDescription,
    createSnippet: t.home.createSnippet,
    exploreSnippets: t.home.exploreSnippets,
    instantAnalysisTitle: t.home.instantAnalysisTitle,
    instantAnalysisDesc: t.home.instantAnalysisDesc,
    communityDrivenTitle: t.home.communityDrivenTitle,
    communityDrivenDesc: t.home.communityDrivenDesc,
    ctaTitle: t.home.ctaTitle,
    ctaDescription: t.home.ctaDescription,
    getStartedFree: t.home.getStartedFree,
  };

  return (
    <MainLayout locale={locale as string}>
      <HomeRenderBlock
        locale={locale as string}
        translations={homeTranslations}
      />
    </MainLayout>
  );
}
