'use client';

import { useLocaleStore } from '@/store/locale';
import { useChangeLocale, useCurrentLocale } from '@/i18n/client';
import { useEffect, useTransition } from 'react';
import { LocaleProps } from '@/i18n/config';

export function useLocale() {
  const store = useLocaleStore();
  const { changeLocale: nextIntlChangeLocale, isChangingLocale } =
    useChangeLocale();
  const currentNextIntlLocale = useCurrentLocale();
  const [isPending, startTransition] = useTransition();

  // ✅ FIX: Move sync logic to useEffect instead of render
  useEffect(() => {
    // Only sync if store is hydrated and locales don't match
    if (store.isHydrated && store.locale !== currentNextIntlLocale) {
      store.setLocale(currentNextIntlLocale);
    }
  }, [store.isHydrated, store.locale, currentNextIntlLocale, store.setLocale]);

  // Enhanced change locale with loading states
  const changeLocale = (locale: LocaleProps, pathname?: string) => {
    // Update store
    store.setLocale(locale);
    store.setChanging(true);

    // Use next-intl routing
    startTransition(() => {
      // ✅ FIX: Get current pathname without locale prefix
      const currentPath = pathname || window.location.pathname;
      const pathWithoutLocale = currentPath.replace(/^\/(en|vi)/, '') || '/';

      nextIntlChangeLocale({
        locale,
        pathname: pathWithoutLocale, // Use path without locale prefix
      });

      // Reset changing state after transition
      setTimeout(() => store.setChanging(false), 500); // Increased timeout
    });
  };

  // Return safe defaults during SSR/hydration
  if (!store.isHydrated) {
    return {
      locale: currentNextIntlLocale || ('en' as LocaleProps),
      isChanging: false,
      isHydrated: false,
      changeLocale,
    };
  }

  return {
    locale: store.locale,
    isChanging: store.isChanging || isChangingLocale || isPending,
    isHydrated: store.isHydrated,
    changeLocale,
  };
}
