import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import Image from 'next/image';
import LocaleFooter from '@/components/common/locale-footer';

interface FooterTranslations {
  description: string;
  product: string;
  snippets: string;
  createSnippet: string;
  tags: string;
  legal: string;
  privacy: string;
  terms: string;
  cookiePolicy: string;
  copyright: string;
}

interface FooterProps {
  locale: string;
  translations: FooterTranslations;
}

export function Footer({ locale, translations }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: translations.snippets, href: `/${locale}/snippets` },
      { name: translations.createSnippet, href: `/${locale}/snippets/new` },
      { name: translations.tags, href: `/${locale}/tags` },
    ],
    legal: [
      { name: translations.privacy, href: `#` },
      { name: translations.terms, href: `#` },
      { name: translations.cookiePolicy, href: `#` },
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/anguyn', icon: Github },
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/nguyen-an-226a84149/',
        icon: Linkedin,
      },
    ],
  };

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href={`/${locale}`}
              className="mb-4 flex items-center gap-2 font-semibold"
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={32}
                height={32}
                priority
                className=""
              />
              <span className="text-xl">CodeBin</span>
            </Link>
            <p className="mb-4 max-w-xs text-sm text-[var(--color-muted-foreground)]">
              {translations.description}
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{translations.product}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{translations.legal}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            © {currentYear} CodeBin. {translations.copyright}
          </p>
          <LocaleFooter />
        </div>
      </div>
    </footer>
  );
}
