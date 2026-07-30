import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BatteryCharging,
  Eye,
  EyeOff,
  Gauge,
  House,
  RefreshCw,
  ShieldCheck,
  Sun,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'

export default function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    alert(`Welcome back, ${email}!`)
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full max-w-[420px]">
            <header>
              <h1 className="font-heading text-2xl font-bold leading-8">
                Welcome back
              </h1>

              <p className="mt-1.5 text-sm text-text-tertiary">
                Sign in to your GridX account
              </p>
            </header>

            <form onSubmit={handleSignIn} className="mt-7">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
                >
                  Email address
                </label>

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 h-12 rounded-2xl border-input bg-secondary px-4 text-sm text-foreground shadow-none placeholder:text-text-disabled focus-visible:border-ring focus-visible:ring-ring/20"
                  required
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
                  >
                    Password
                  </label>

                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs font-semibold text-accent"
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-2xl border-input bg-secondary px-4 pr-12 text-sm text-foreground shadow-none placeholder:text-text-disabled focus-visible:border-ring focus-visible:ring-ring/20"
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-0 top-0 size-12 text-text-disabled hover:bg-transparent hover:text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-4">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  className="size-5 rounded-[10px] border-2 border-input bg-transparent data-checked:border-accent data-checked:bg-accent"
                />

                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                disabled={!email || !password}
                className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90 disabled:bg-accent/30 disabled:text-text-tertiary"
              >
                Sign in
              </Button>

              <div className="my-6 flex items-center gap-3 text-xs font-medium text-text-disabled">
                <span className="h-px flex-1 bg-muted/50" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-muted/50" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start gap-3 rounded-2xl bg-card px-[17px] text-sm font-semibold"
              >
                <img
                  src="/auth/uae-pass.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[18px] w-7 shrink-0"
                />

                <span className="flex-1 text-left">UAE PASS</span>

                <span className="shrink-0 rounded-full bg-[#e8eef6] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-[15px] text-[#4a5f78] dark:bg-[rgba(148,180,220,0.1)] dark:text-[#c8d6e8]">
                  UAE Digital ID
                </span>

                <img
                  src="/auth/chevron-right.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                />
              </Button>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold"
                >
                  <img
                    src="/auth/google.svg"
                    alt=""
                    aria-hidden="true"
                    className="size-[18px] shrink-0"
                  />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold"
                >
                  <img
                    src="/auth/microsoft.svg"
                    alt=""
                    aria-hidden="true"
                    className="size-[17px] shrink-0"
                  />
                  Microsoft
                </Button>
              </div>

              <p className="mt-2.5 text-center text-[10px] text-text-disabled">
                These options may not yet be available in all regions.
              </p>

              <p className="mt-6 text-center text-sm text-text-tertiary">
                New to GridX?{' '}
                <Link
                  to="/sign-up"
                  className="font-semibold text-accent hover:underline"
                >
                  Create Account
                </Link>
              </p>

              <div className="mt-5 border-t border-border-subtle pt-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-disabled">
                  Demo shortcut
                </p>

                <Link
                  to="/"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  Skip to portal
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </form>
          </div>
        </section>

        <SignInVisualPanel />
      </div>
    </main>
  )
}

function SignInVisualPanel() {
  const networkNodes = [
    {
      label: 'Solar PV',
      sublabel: 'JLT Zone 4',
      icon: Sun,
      className: 'left-[8%] top-[12%]',
    },
    {
      label: 'Battery',
      sublabel: 'DIFC',
      icon: BatteryCharging,
      className: 'left-1/2 top-[2%] -translate-x-1/2',
    },
    {
      label: 'EV Export',
      sublabel: 'Downtown',
      icon: Zap,
      className: 'right-[8%] top-[12%]',
    },
    {
      label: 'Villa',
      sublabel: 'Al Quoz',
      icon: House,
      className: 'left-[8%] bottom-[4%]',
    },
    {
      label: 'Apartment',
      sublabel: 'Business Bay',
      icon: House,
      className: 'left-1/2 bottom-[-2%] -translate-x-1/2',
    },
    {
      label: 'Townhouse',
      sublabel: 'JBR',
      icon: House,
      className: 'right-[8%] bottom-[4%]',
    },
  ]

  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-sidebar px-10 py-10 lg:block">
      <div className="absolute -top-28 right-0 size-[500px] rounded-full bg-accent/10 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-chart-4/[0.07] blur-[90px]" />

      <div className="relative mx-auto flex h-full max-w-[590px] flex-col">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Zap className="size-[18px] fill-current" />
          </span>

          <span className="font-heading text-xl font-bold text-white">
            GridX
          </span>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] text-emerald-300">
            Beta
          </span>
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-accent">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            LIVE ENERGY MARKETPLACE
          </span>
        </div>

        <div className="relative mx-auto mt-8 h-[300px] w-full max-w-[520px]">
          <svg
            className="absolute inset-0 size-full text-accent"
            viewBox="0 0 520 300"
            aria-hidden="true"
          >
            <g stroke="currentColor" strokeDasharray="5 6" strokeOpacity=".38">
              <line x1="260" y1="150" x2="80" y2="55" />
              <line x1="260" y1="150" x2="260" y2="30" />
              <line x1="260" y1="150" x2="440" y2="55" />
              <line x1="260" y1="150" x2="80" y2="245" />
              <line x1="260" y1="150" x2="260" y2="275" />
              <line x1="260" y1="150" x2="440" y2="245" />
            </g>
          </svg>

          <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent bg-accent/10 text-accent shadow-[0_0_50px_rgba(14,165,146,.18)]">
            <Zap className="size-5 fill-current" />
            <span className="mt-1 text-[8px] font-bold">GRIDX</span>
          </div>

          {networkNodes.map(({ label, sublabel, icon: Icon, className }) => (
            <div
              key={label}
              className={`absolute flex size-16 flex-col items-center justify-center rounded-full border border-accent/45 bg-[#1a2840] text-center shadow-[0_0_0_1px_rgba(14,165,146,0.08)] ${className}`}
            >
              <Icon className="size-3.5 text-accent" />

              <span className="mt-1 text-[8px] font-semibold leading-[10px] text-[#a8bdd4]">
                {label}
              </span>

              <span className="mt-0.5 text-[6px] leading-[8px] text-[#60748d]">
                {sublabel}
              </span>
            </div>
          ))}

          <p className="absolute bottom-0 left-0 flex items-center gap-1.5 text-[8px] text-text-disabled">
            <span className="size-1.5 rounded-full bg-accent" />
            Energy trading in progress · Live
          </p>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-2xl font-bold leading-[1.25] text-white">
            Power your future,
            <br />
            one trade at a time
          </h2>

          <p className="mt-3 max-w-[310px] text-sm leading-[1.65] text-[#8492a6]">
            Sign in to manage your clean-energy portfolio and trade directly
            with your local energy community.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <Benefit icon={Gauge} label="24/7 live energy marketplace" />
          <Benefit icon={ShieldCheck} label="Bank-grade encrypted sessions" />
          <Benefit icon={RefreshCw} label="Instant portfolio sync" />
        </div>

        <div className="mt-auto border-t border-sidebar-border pt-5">
          <p className="text-xs tracking-[0.18em] text-chart-3">★★★★★</p>

          <p className="mt-2 text-sm italic leading-6 text-[#93a0b2]">
            “Sold 18 kWh this month to neighbours — earned more than my
            electricity bill.”
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
              SA
            </span>

            <div>
              <p className="text-xs font-semibold text-white">Sara A.</p>

              <p className="text-[10px] leading-4 text-[#68768a]">
                Solar prosumer · JLT Zone 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Benefit({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-9 items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/15 text-accent">
        <Icon className="size-3.5" />
      </span>

      <p className="min-w-0 text-sm font-medium leading-5 text-white">
        {label}
      </p>
    </div>
  )
}
