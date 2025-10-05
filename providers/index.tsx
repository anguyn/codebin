'use client';

// import { Toaster } from '#/components/custom-ui/toaster';
// import { ToastProvider } from '#/components/custom-ui/use-toast';
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
        storageKey="code-bin" // Custom storage key
      >
        <LocaleInitializer initialLocale={locale} />
        <div id="site-wrapper">
          {children}
          <Sonner
            // richColors
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
