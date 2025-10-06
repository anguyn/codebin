'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Globe, Loader2 } from 'lucide-react';
import { i18n, LocaleProps } from '@/i18n/config';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/hooks/use-locale';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const localeLabels = {
  en: { label: 'English', flag: '🇺🇸' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor className="h-4 w-4" />;
    if (resolvedTheme === 'dark') return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="h-9 transition-colors hover:cursor-pointer"
      title={`Current theme: ${theme} (${resolvedTheme})`}
    >
      {getThemeIcon()}
    </Button>
  );
}

export function LocaleSelector() {
  const { locale, changeLocale, isChanging, isHydrated } = useLocale();
  const t = useTranslations('common');

  if (!isHydrated) {
    return (
      <Select disabled>
        <SelectTrigger className="h-9 w-auto min-w-[120px]">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{t('loading')}...</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={locale}
      onValueChange={value => changeLocale(value as LocaleProps)}
      disabled={isChanging}
    >
      <SelectTrigger className="h-9 w-auto min-w-[120px] hover:cursor-pointer">
        <div className="flex items-center gap-2">
          {isChanging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="text-sm">
            {localeLabels[locale]?.flag} {localeLabels[locale]?.label}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map(localeOption => (
          <SelectItem key={localeOption} value={localeOption}>
            <div className="flex items-center gap-2 hover:cursor-pointer">
              <span>{localeLabels[localeOption]?.flag}</span>
              <span>{localeLabels[localeOption]?.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeLocaleControls({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LocaleSelector />
      <ThemeToggle />
    </div>
  );
}
