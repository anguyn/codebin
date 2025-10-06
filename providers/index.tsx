'use client';

import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { LocaleInitializer } from './locale-initializer';
import { Toaster as Sonner } from 'sonner';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface ProvidersProps extends PropsWithChildren {
  locale?: 'en' | 'vi';
}

const Providers = ({ children, locale }: ProvidersProps) => {
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="code-bin"
      >
        <LocaleInitializer initialLocale={locale} />
        <div id="site-wrapper">
          {children}
          <Sonner
            position="top-center"
            closeButton
            theme="light"
            toastOptions={{
              style: {
                borderRadius: '8px',
              },
            }}
          />
        </div>
      </ThemeProvider>
    </NextAuthSessionProvider>
  );
};

export { Providers };
