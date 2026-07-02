import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'

import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
] as const

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-sm font-semibold text-text-primary no-underline shadow-sm transition hover:bg-bg-elevated"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span>GridX</span>
        </Link>

        <div className="order-3 flex w-full items-center gap-1 sm:order-0 sm:w-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: 'bg-bg-elevated text-text-primary',
              }}
              className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
          >
            Docs
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
