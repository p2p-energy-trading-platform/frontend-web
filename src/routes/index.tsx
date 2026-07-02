import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BatteryCharging,
  ChartCandlestick,
  ShieldCheck,
  Zap,
} from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/')({
  component: App,
})

const features = [
  {
    title: 'Live Energy Market',
    description:
      'Track local buy and sell orders across neighbourhood energy pools.',
    icon: ChartCandlestick,
  },
  {
    title: 'Smart Meter Ready',
    description:
      'Designed around verified production, usage, and settlement events.',
    icon: Zap,
  },
  {
    title: 'Battery & Solar Aware',
    description:
      'Model energy availability across storage, solar generation, and grid state.',
    icon: BatteryCharging,
  },
  {
    title: 'Secure Settlements',
    description:
      'Prepare the interface for auditable, role-aware transaction workflows.',
    icon: ShieldCheck,
  },
]

const stats = [
  ['142.85 MWh', 'Energy traded'],
  ['2,418', 'Market orders'],
  ['98.7%', 'Grid sync health'],
]

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-primary-muted blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-brand-info-muted blur-3xl" />

            <div className="relative">
              <Badge variant="secondary" className="mb-5">
                GridX Demo Interface
              </Badge>

              <h1 className="max-w-4xl text-display-lg text-text-primary sm:text-display-xl lg:text-display-2xl">
                Peer-to-peer energy trading for local power grids.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                This temporary demo page uses the GridX design tokens, Base UI
                shadcn components, and the monochrome trading-dashboard visual
                direction from the Figma design system.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  View demo details
                  <ArrowRight className="size-4" />
                </Link>

                <a
                  href="https://tanstack.com/start/latest/docs/framework/react/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  TanStack Start docs
                </a>
              </div>
            </div>
          </section>

          <Card className="border-border-subtle bg-bg-surface">
            <CardHeader>
              <CardDescription>Market snapshot</CardDescription>
              <CardTitle className="text-heading-2">
                Local Grid — Block A
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3"
                >
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-heading-4 text-text-primary">
                    {value}
                  </span>
                </div>
              ))}

              <div className="rounded-xl border border-border-subtle bg-bg-sunken p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-label-md text-text-tertiary">
                    GRID STATUS
                  </span>
                  <Badge className="bg-brand-primary text-primary-foreground">
                    Synced
                  </Badge>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-bg-overlay">
                  <div className="h-full w-[78%] rounded-full bg-brand-primary" />
                </div>

                <p className="mt-3 text-caption text-text-secondary">
                  78% utilization across registered producers and consumers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="border-border-subtle bg-bg-surface transition hover:-translate-y-0.5 hover:border-border-default hover:bg-bg-elevated"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-border-subtle bg-bg-elevated">
                    <Icon className="size-5 text-text-primary" />
                  </div>
                  <CardTitle className="text-heading-4">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </section>

        <Card className="border-border-subtle bg-bg-surface">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Temporary page
            </Badge>
            <CardTitle className="text-heading-2">
              Ready for actual product content
            </CardTitle>
            <CardDescription className="max-w-3xl">
              This is only a polished placeholder. Later, replace this with the
              real landing page, authentication flow, dashboard, order book,
              user profile, and market pages.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  )
}