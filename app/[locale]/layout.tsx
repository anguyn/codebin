import { Metadata } from 'next';
import { typographyVariants } from '@/components/common/typography';
import {
  fontArchivoBlack,
  fontManrope,
  fontMontserrat,
  fontRoboto,
  fontSans,
} from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';
import { PageProps } from '@/types/global';
import { getMessages } from 'next-intl/server';
import { i18n } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { PropsWithChildren } from 'react';
import { getStaticParams, setStaticParamsLocale } from '@/i18n/server';
import { NextIntlClientProvider } from 'next-intl';
import '@/styles/globals.css';
import { getServerLocale } from '@/lib/server/utils';

interface LocaleLayoutProps
  extends Pick<PageProps, 'params'>,
    PropsWithChildren {}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

//   const res = await fetch(`${baseUrl}/api/system-config?lang=${locale}`, {
//     next: {
//       revalidate: 300,
//       tags: ['system-config', `locale-${locale}`],
//     },
//   });

//   const json = await res.json();
//   const data = json?.data || {};

//   const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';

//   return {
//     title: {
//       default: data.defaultTitle,
//       template: `%s | ${data.appName || process.env.NEXT_PUBLIC_DEFAULT_APP_NAME}`,
//     },
//     icons: {
//       icon: `${url}/api/favicon`,
//       shortcut: `${url}/api/favicon`,
//       apple: `${url}/api/favicon`,
//     },
//     // Add theme-color meta for mobile
//     other: {
//       'theme-color': '#ffffff', // Will be updated by next-themes
//     },
//   };
// }

export const generateStaticParams = () => {
  return getStaticParams();
};

const LocaleLayout = async (props: LocaleLayoutProps) => {
  const { locale } = await props.params;

  // Validate locale
  if (!locale || !i18n.locales.includes(locale)) {
    notFound();
  }

  // Set locale for static params
  setStaticParamsLocale(locale);

  // Get messages for i18n
  const messages = await getMessages();

  // Get server locale from cookies (for zustand store)
  const serverLocale = await getServerLocale();

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Meta theme-color will be managed by next-themes */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>

      <body
        suppressHydrationWarning
        className={cn(
          // Font variables
          fontSans.variable,
          fontManrope.variable,
          fontArchivoBlack.variable,
          fontMontserrat.variable,
          fontRoboto.variable,
          'font-Manrope relative antialiased',

          // Base theme colors (will be overridden by next-themes)
          'bg-background text-foreground',

          // Typography
          typographyVariants({ variant: 'body' }),
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers locale={serverLocale}>{props.children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
