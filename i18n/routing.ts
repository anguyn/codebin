import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { i18n, LocaleProps } from './config';

export const routing = defineRouting({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

export interface DictionaryStructure {
  login: {
    title: string;
    subTitle: string;
    pageDescription: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    submitButton: string;
    welcomeBack: string;
    signInTitle: string;
    dontHaveAccount: string;
    signUp: string;
    invalidCredentials: string;
    loginSuccess: string;
    somethingWentWrong: string;
    invalidEmail: string;
    passwordMinLength: string;
    followTerms: string;
    tos: string;
    pp: string;
  };
  register: {
    title: string;
    subTitle: string;
    pageDescription: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    gender: string;
    birthday: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    male: string;
    female: string;
    alreadyHaveAccount: string;
    signIn: string;
    nameMinLength: string;
    invalidEmail: string;
    passwordMinLength: string;
    passwordsDontMatch: string;
    registrationFailed: string;
    accountCreatedSuccess: string;
    somethingWentWrong: string;
    followTerms: string;
    tos: string;
    pp: string;
  };
  api: {
    snippet: {
      notFound: string;
      unauthorized: string;
      forbidden: string;
      forbiddenEdit: string;
      forbiddenDelete: string;
      fetchFailed: string;
      updateFailed: string;
      deleteFailed: string;
    };
    analyzeComplexity: {
      noCodeProvided: string;
      failedToAnalyze: string;
      o1: string;
      oLogN: string;
      oN: string;
      oNLogN: string;
      oN2: string;
      oN3: string;
      o2N: string;
      unknownComplexity: string;
      note: string;
    };
  };
}

export type TranslateDictionariesProps = {
  [key in LocaleProps]: DictionaryStructure;
};
