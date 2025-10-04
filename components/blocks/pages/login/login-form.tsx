'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { authenticate } from '@/app/actions/login.action';
import { useSession } from 'next-auth/react';

interface LoginFormTranslations {
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  signIn: string;
  dontHaveAccount: string;
  signUp: string;
  invalidCredentials: string;
  loginSuccess: string;
  somethingWentWrong: string;
  invalidEmail: string;
  passwordMinLength: string;
}

interface LoginFormProps {
  locale: string;
  translations: LoginFormTranslations;
  callbackUrl?: string;
}

export function LoginForm({
  locale,
  translations,
  callbackUrl = '/',
}: LoginFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(translations.invalidEmail),
    password: z.string().min(6, translations.passwordMinLength),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await authenticate({
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        toast.error(result.error || translations.invalidCredentials);
      } else {
        toast.success(translations.loginSuccess);
        await update();
        router.push(`/${locale}${callbackUrl}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(translations.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {translations.email}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={translations.emailPlaceholder}
          disabled={isLoading}
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            {translations.password}
          </label>
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-primary text-sm hover:underline"
          >
            {translations.forgotPassword}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={translations.passwordPlaceholder}
          disabled={isLoading}
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {translations.signIn}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {translations.dontHaveAccount}{' '}
        </span>
        <Link
          href={`/${locale}/register`}
          className="text-primary font-medium hover:underline"
        >
          {translations.signUp}
        </Link>
      </div>
    </form>
  );
}
