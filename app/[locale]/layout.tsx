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
import { getMessages } from 'next-intl/server';
import { i18n, LocaleProps } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { getStaticParams, setStaticParamsLocale } from '@/i18n/server';
import { NextIntlClientProvider } from 'next-intl';
import '@/styles/globals.css';
import { getServerLocale } from '@/lib/server/utils';

interface LocaleLayoutProps extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => {
  return getStaticParams();
};

function isValidLocale(locale: string): locale is LocaleProps {
  return i18n.locales.includes(locale as LocaleProps);
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const lang = locale || 'en'; // fallback nếu locale undefined
//   const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';

//   // ✅ Lấy file JSON từ public thông qua fetch
//   let data: any = {};
//   try {
//     const res = await fetch(`${url}/meta/${lang}.json`, {
//       cache: 'force-cache',
//     });
//     data = await res.json();
//   } catch {
//     // fallback nếu file không tồn tại
//     const res = await fetch(`${url}/meta/en.json`, { cache: 'force-cache' });
//     data = await res.json();
//   }

//   return {
//     title: {
//       default: data.defaultTitle || 'CodeBin',
//       template: `%s | ${data.appName || 'CodeBin'}`,
//     },
//     description:
//       data.description || 'CodeBin — Share and manage code snippets easily.',
//     icons: {
//       icon: `${url}/favicon.ico`,
//       shortcut: `${url}/favicon.ico`,
//       apple: `${url}/favicon.ico`,
//     },
//     other: {
//       'theme-color': '#ffffff',
//     },
//   };
// }

const LocaleLayout = async (props: LocaleLayoutProps) => {
  const params = await props.params;
  const { locale } = params;

  // Validate locale với type guard
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  const validLocale = locale as LocaleProps;

  // Set locale for static params
  setStaticParamsLocale(validLocale);

  const messages = await getMessages();
  const serverLocale = await getServerLocale();

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>

      <body
        suppressHydrationWarning
        className={cn(
          fontSans.variable,
          fontManrope.variable,
          fontArchivoBlack.variable,
          fontMontserrat.variable,
          fontRoboto.variable,
          'font-Manrope relative antialiased',
          'bg-background text-foreground',
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
