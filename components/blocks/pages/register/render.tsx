'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from './register-form';
import { useLocale } from '@/lib/hooks/use-locale';
import { ThemeLocaleControls } from '@/components/common/theme-locale-control';
import { useTranslations } from 'next-intl';

interface RegisterFormTranslations {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  createAccount: string;
  alreadyHaveAccount: string;
  signIn: string;
  nameMinLength: string;
  invalidEmail: string;
  passwordMinLength: string;
  passwordsDontMatch: string;
  registrationFailed: string;
  accountCreatedSuccess: string;
  somethingWentWrong: string;
}

interface RegisterRenderBlockProps {
  translations: RegisterFormTranslations;
}

const RegisterRenderBlock = ({ translations }: RegisterRenderBlockProps) => {
  const { locale } = useLocale();
  const t = useTranslations('register');

  return (
    <div className="from-background to-secondary/20 relative flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="absolute top-2 right-2 z-20 flex justify-center">
        <ThemeLocaleControls />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <Code2 className="text-primary-foreground h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">CodeBin</h1>
          <p className="text-muted-foreground">
            Share your code with the world
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('createAccount')}</CardTitle>
            <CardDescription>{t('signUpTitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm locale={locale} translations={translations} />
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          By continuing, you agree to our{' '}
          <Link
            href={`/${locale}/terms`}
            className="hover:text-foreground underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href={`/${locale}/privacy`}
            className="hover:text-foreground underline"
          >
            Privacy Policy
          </Link>
        </p>
        <p className="text-center">{t('copyright')}</p>
      </div>
    </div>
  );
};

export default RegisterRenderBlock;
