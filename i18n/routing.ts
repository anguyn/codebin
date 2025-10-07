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
  common: {
    share: string;
    save: string;
    saved: string;
    edit: string;
    delete: string;
    views: string;
    saves: string;
    code: string;
    explore: string;
    snippets: string;
    tags: string;
    search: string;
    create: string;
    description: string;
    product: string;
    createSnippet: string;
    legal: string;
    privacy: string;
    terms: string;
    cookiePolicy: string;
    copyright: string;
    previous: string;
    next: string;
  };
  home: {
    title: string;
    pageDescription: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroDescription: string;
    createSnippet: string;
    exploreSnippets: string;
    instantAnalysisTitle: string;
    instantAnalysisDesc: string;
    communityDrivenTitle: string;
    communityDrivenDesc: string;
    ctaTitle: string;
    ctaDescription: string;
    getStartedFree: string;
  };
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
    signUpTitle: string;
    pageDescription: string;
    createAccount: string;
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
  favorites: {
    title: string;
    pageDescription: string;
    savedSnippet: string;
    pluralSuffix: string;
    noFavoritesYet: string;
    noFavoritesDescription: string;
  };
  snippets: {
    notFound: string;
    timeComplexity: string;
    estimatedComplexity: string;
    complexityDisclaimer: string;
    aboutAuthor: string;
    viewProfile: string;
    loginToSave: string;
    title: string;
    pageDescription: string;
    allSnippets: string;
    searchResults: string;
    snippetsFound: string;
    snippetFound: string;
    mostRecent: string;
    mostViewed: string;
    mostLiked: string;
    language: string;
    tag: string;
    search: string;
    noSnippetsFound: string;
    createTitle: string;
    createDescription: string;
  };
  search: {
    description: string;
    search: string;
    searchResults: string;
    foundResults: string;
    result: string;
    results: string;
    for: string;
    all: string;
    snippets: string;
    tags: string;
    users: string;
    enterSearchQuery: string;
    noResultsFound: string;
    snippetsCount: string;
  };
  tags: {
    title: string;
    pageDescription: string;
    browseByTags: string;
    description: string;
    topics: string;
    languages: string;
    snippet: string;
    snippets: string;
    noTopicsFound: string;
    noLanguagesFound: string;
    notFound: string;
    browseSnippets: string;
    explore: string;
    codeSnippetsTagged: string;
    language: string;
    topic: string;
    found: string;
    noSnippetsFound: string;
  };
  userProfile: {
    notFound: string;
    profile: string;
    viewProfile: string;
    codeSnippetsAndProfile: string;
    editProfile: string;
    joined: string;
    snippet: string;
    snippets: string;
    snippetsLabel: string;
    views: string;
    favorites: string;
    languages: string;
    topLanguages: string;
    mySnippets: string;
    publicSnippets: string;
    createNew: string;
    noSnippetsYet: string;
    noPublicSnippets: string;
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
