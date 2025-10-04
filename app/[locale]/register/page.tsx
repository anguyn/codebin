import RegisterRenderBlock from '@/components/blocks/pages/register/render';
import {
  getTranslate,
  setStaticParamsLocale,
  getStaticParams,
} from '@/i18n/server';
import { PageProps } from '@/types/global';
import { Metadata } from 'next';

export const generateStaticParams = getStaticParams;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  return {
    title: t.register.title || 'Register',
    description: t.register.pageDescription || 'Create your account',
    keywords: 'register, signup, create account, authentication',
  };
}

const RegisterPage = async (props: PageProps) => {
  const params = await props.params;
  const { locale } = params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  // Prepare translations cho RegisterForm
  const registerFormTranslations = {
    name: t.register.name,
    namePlaceholder: t.register.namePlaceholder,
    email: t.register.email,
    emailPlaceholder: t.register.emailPlaceholder,
    password: t.register.password,
    passwordPlaceholder: t.register.passwordPlaceholder,
    confirmPassword: t.register.confirmPassword,
    confirmPasswordPlaceholder: t.register.confirmPasswordPlaceholder,
    createAccount: t.register.pageDescription,
    alreadyHaveAccount: t.register.alreadyHaveAccount,
    signIn: t.register.signIn,
    nameMinLength: t.register.nameMinLength,
    invalidEmail: t.register.invalidEmail,
    passwordMinLength: t.register.passwordMinLength,
    passwordsDontMatch: t.register.passwordsDontMatch,
    registrationFailed: t.register.registrationFailed,
    accountCreatedSuccess: t.register.accountCreatedSuccess,
    somethingWentWrong: t.register.somethingWentWrong,
  };

  return <RegisterRenderBlock translations={registerFormTranslations} />;
};

export default RegisterPage;
