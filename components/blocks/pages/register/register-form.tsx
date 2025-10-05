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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

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

interface RegisterFormProps {
  locale: string;
  translations: RegisterFormTranslations;
}

export function RegisterForm({ locale, translations }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || translations.registrationFailed);
        return;
      }

      toast.success(translations.accountCreatedSuccess);
      router.push(`/${locale}/login`);
    } catch (error) {
      toast.error(translations.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="mb-2">
          <label htmlFor="name" className="text-sm font-medium">
            {translations.name}
          </label>
        </div>
        <Input
          id="name"
          type="text"
          placeholder={translations.namePlaceholder}
          disabled={isLoading}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="mb-2">
          <label htmlFor="email" className="text-sm font-medium">
            {translations.email}
          </label>
        </div>
        <Input
          id="email"
          type="email"
          placeholder={translations.emailPlaceholder}
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="mb-2">
          <label htmlFor="password" className="text-sm font-medium">
            {translations.password}
          </label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={translations.passwordPlaceholder}
          disabled={isLoading}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="mb-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            {translations.confirmPassword}
          </label>
        </div>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={translations.confirmPasswordPlaceholder}
          disabled={isLoading}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {translations.createAccount}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {translations.alreadyHaveAccount}{' '}
        </span>
        <Link
          href={`/${locale}/login`}
          className="text-primary font-medium hover:underline"
        >
          {translations.signIn}
        </Link>
      </div>
    </form>
  );
}
