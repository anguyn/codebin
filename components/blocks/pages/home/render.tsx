'use client';

import { useLocale } from '@/lib/hooks/use-locale';
import { useTranslations } from 'next-intl';

interface HomeTranslations {}

interface HomeRenderBlockProps {
  translations: HomeTranslations;
}

const HomeRenderBlock = ({ translations }: HomeRenderBlockProps) => {
  const { locale } = useLocale();
  const t = useTranslations('login');

  return <></>;
};

export default HomeRenderBlock;
