'use client';

import { useEffect, useCallback } from 'react';
import { useLocaleStore } from '@/store/locale';
import { useCurrentLocale } from '@/i18n/client';

interface LocaleInitializerProps {
  initialLocale?: string;
}

export function LocaleInitializer({
  initialLocale = 'en',
}: LocaleInitializerProps) {
  const { setLocale, setHydrated, isHydrated } = useLocaleStore();
  const currentNextIntlLocale = useCurrentLocale();

  // ✅ Memoize setLocale to prevent unnecessary re-renders
  const initializeLocale = useCallback(() => {
    if (!isHydrated) {
      // Rehydrate store from localStorage
      useLocaleStore.persist.rehydrate();

      // Use current next-intl locale (most accurate)
      setLocale(currentNextIntlLocale);
      setHydrated(true);
    }
  }, [currentNextIntlLocale, setLocale, setHydrated, isHydrated]);

  useEffect(() => {
    initializeLocale();
  }, [initializeLocale]);

  return null;
}
