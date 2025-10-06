import { Header } from './header';
import { Footer } from './footer';
import { getTranslate } from '@/i18n/server';

interface MainLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export async function MainLayout({ children, locale }: MainLayoutProps) {
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  const headerTranslations = {
    explore: t.common?.explore || 'Explore',
    snippets: t.common?.snippets || 'Snippets',
    tags: t.common?.tags || 'Tags',
    search: t.common?.search || 'Search snippets...',
    create: t.common?.create || 'Create',
  };

  const footerTranslations = {
    description:
      t.common?.description ||
      'Share, discover, and collaborate on code snippets with developers worldwide.',
    product: t.common?.product || 'Product',
    snippets: t.common?.snippets || 'Snippets',
    createSnippet: t.common?.createSnippet || 'Create Snippet',
    tags: t.common?.tags || 'Tags',
    legal: t.common?.legal || 'Legal',
    privacy: t.common?.privacy || 'Privacy',
    terms: t.common?.terms || 'Terms',
    cookiePolicy: t.common?.cookiePolicy || 'Cookie Policy',
    copyright: t.common?.copyright || 'All rights reserved.',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} translations={headerTranslations} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} translations={footerTranslations} />
    </div>
  );
}
