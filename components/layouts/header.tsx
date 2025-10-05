'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Search, Plus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/common/input';
import { UserMenu } from './user-menu';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeLocaleControls } from '@/components/common/theme-locale-control';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Explore', href: `/${locale}` },
    { name: 'Snippets', href: `/${locale}/snippets` },
    { name: 'Tags', href: `/${locale}/tags` },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex gap-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 font-semibold"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <Code2 className="h-5 w-5 text-[var(--color-primary-foreground)]" />
              </div>
              <span className="hidden text-lg sm:inline-block">CodeBin</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {navigation.map(item => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-[var(--color-primary)]',
                      isActive
                        ? 'text-[var(--color-foreground)]'
                        : 'text-[var(--color-muted-foreground)]',
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="mx-4 hidden max-w-md flex-1 lg:flex">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                type="search"
                placeholder="Search snippets..."
                className="pr-4 pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Create Button - Desktop */}
            <Button asChild className="hidden gap-2 md:flex">
              <Link href={`/${locale}/snippets/new`}>
                <Plus className="h-4 w-4" />
                Create
              </Link>
            </Button>

            <ThemeLocaleControls className="hidden md:flex" />

            {/* User Menu */}
            <UserMenu locale={locale} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="space-y-4 border-t border-[var(--color-border)] py-4 md:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                type="search"
                placeholder="Search snippets..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {navigation.map(item => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                        : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Create Button */}
            <Button asChild className="w-full gap-2">
              <Link
                href={`/${locale}/snippets/new`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Create Snippet
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
