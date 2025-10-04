import Link from 'next/link';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: `/${locale}/features` },
      { name: 'Pricing', href: `/${locale}/pricing` },
      { name: 'Documentation', href: `/${locale}/docs` },
    ],
    company: [
      { name: 'About', href: `/${locale}/about` },
      { name: 'Blog', href: `/${locale}/blog` },
      { name: 'Careers', href: `/${locale}/careers` },
    ],
    legal: [
      { name: 'Privacy', href: `/${locale}/privacy` },
      { name: 'Terms', href: `/${locale}/terms` },
      { name: 'Cookie Policy', href: `/${locale}/cookies` },
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com', icon: Github },
      { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
      { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    ],
  };

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href={`/${locale}`}
              className="mb-4 flex items-center gap-2 font-semibold"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <Code2 className="h-5 w-5 text-[var(--color-primary-foreground)]" />
              </div>
              <span className="text-lg">CodeBin</span>
            </Link>
            <p className="mb-4 max-w-xs text-sm text-[var(--color-muted-foreground)]">
              Share, discover, and collaborate on code snippets with developers
              worldwide.
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

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
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

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(item => (
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

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
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

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            © {currentYear} CodeBin. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              English
            </button>
            <span className="text-[var(--color-muted-foreground)]">|</span>
            <button className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              Tiếng Việt
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
