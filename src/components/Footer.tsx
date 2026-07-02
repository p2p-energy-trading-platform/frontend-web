import { Github, Zap } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border-subtle bg-background px-4 py-10 text-text-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            GridX
          </div>

          <p className="m-0 text-sm">
            &copy; {year} GridX. Temporary demo interface.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="m-0 text-label-sm text-text-tertiary">
            BUILT WITH TANSTACK START
          </p>

          <a
            href="https://github.com/TanStack"
            target="_blank"
            rel="noreferrer"
            aria-label="Go to TanStack GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
          >
            <Github className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}