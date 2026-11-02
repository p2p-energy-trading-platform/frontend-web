import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import ThemeToggle from './ThemeToggle';
import { Button, buttonVariants } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const navigationItems = [
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Benefits', id: 'benefits' },
  { label: 'Assets', id: 'assets' },
  { label: 'FAQ', id: 'faq' },
];

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const sectionHref = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/85 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl flex-nowrap items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border-subtle bg-card px-3 py-2 text-sm font-semibold text-text-primary no-underline shadow-sm transition hover:bg-secondary"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span>GridX</span>
        </Link>

        <div className="hidden items-center gap-5 xl:flex">
          <Link
            to="/"
            className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-primary"
          >
            Home
          </Link>

          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={sectionHref(item.id)}
              className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}

          <Link
            to="/about"
            className="text-sm font-medium text-text-secondary no-underline transition-colors hover:text-primary"
          >
            About
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <Link to="/sign-in" className={buttonVariants({ size: 'sm' })}>
            Sign in
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="xl:hidden"
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 p-0 sm:w-80">
              <SheetHeader>
                <SheetTitle>GridX Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4 pb-6">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
                >
                  Home
                </Link>

                {navigationItems.map((item) => (
                  <a
                    key={item.id}
                    href={sectionHref(item.id)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </a>
                ))}

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
                >
                  About
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
