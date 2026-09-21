import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'

import ThemeToggle from './ThemeToggle'
import { buttonVariants } from './ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-card px-3 py-2 text-sm font-semibold text-text-primary no-underline shadow-sm transition hover:bg-secondary"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span>GridX</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link to="/sign-in" className={buttonVariants({ size: 'sm' })}>
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  )
}
