import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { signInBenefits, signInNetworkNodes, signInTestimonial } from '#/data/auth'
import { PasswordInput } from '../ui/password-input'
import { Field, FieldGroup, FieldLabel } from '../ui/field'

export default function SignInForm() {

  return (
    <main className="min-h-screen overflow-y-auto bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full max-w-105">
            <header>
              <h1 className="font-heading text-heading-1">Welcome back</h1>

              <p className="mt-1.5 text-sm text-text-tertiary">
                Sign in to your GridX account
              </p>
            </header>

            <form className="mt-7">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='email'>Email address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl px-4"

                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-12 rounded-2xl"
                    innerClass='px-4'
                    required
                  />
                </Field>
                  
                <Field orientation='horizontal'>
                  <Checkbox
                    id="rememberMe"
                  />
                  <FieldLabel htmlFor='rememberMe'>Remember me for 30 days</FieldLabel>
                   <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs font-semibold text-accent"
                  >
                    Forgot password?
                  </Button>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl"
                  >
                    Sign in
                  </Button>
                </Field>
              </FieldGroup>

              <div className="my-6 flex items-center gap-3 text-xs font-medium text-text-disabled">
                <span className="h-px flex-1 bg-muted/50" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-muted/50" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start gap-3 rounded-2xl bg-card px-4.25 text-sm font-semibold"
              >
                <img
                  src="/auth/uae-pass.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-4.5 w-7 shrink-0"
                />

                <span className="flex-1 text-left">UAE PASS</span>

                <span className="shrink-0 rounded-full bg-background-well px-1.5 py-0.5 font-mono text-caption font-medium leading-3.75 text-text-tertiary dark:bg-white/10 dark:text-text-secondary">
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
                    className="size-4.5 shrink-0"
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
                    className="size-4.25 shrink-0"
                  />
                  Microsoft
                </Button>
              </div>

              <p className="mt-2.5 text-center text-caption text-text-disabled">
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
            </form>
          </div>
        </section>

        <SignInVisualPanel />
      </div>
    </main>
  )
}

function SignInVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-sidebar px-10 py-10 lg:block">
      <div className="absolute -top-28 right-0 size-125 rounded-full bg-accent/10 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-chart-4/[0.07] blur-[90px]" />

      <div className="relative mx-auto flex h-full max-w-147.5 flex-col">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Zap className="size-4.5 fill-current" />
          </span>

          <span className="font-heading text-xl font-bold text-white">
            GridX
          </span>

          <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-caption text-accent">
            Beta
          </span>
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-caption font-bold tracking-[0.12em] text-accent">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            LIVE ENERGY MARKETPLACE
          </span>
        </div>

        <div className="relative mx-auto mt-8 h-75 w-full max-w-130">
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

          <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent bg-accent/10 text-accent shadow-lg shadow-accent/20">
            <Zap className="size-5 fill-current" />
            <span className="mt-1 text-caption font-bold">GRIDX</span>
          </div>

          {signInNetworkNodes.map(
            ({ label, sublabel, icon: Icon, className }) => (
              <div
                key={label}
                className={`absolute flex size-16 flex-col items-center justify-center rounded-full border border-accent/45 bg-white/10 text-center ring-1 ring-accent/10 ${className}`}
              >
                <Icon className="size-3.5 text-accent" />

                <span className="mt-1 text-caption font-semibold leading-2.5 text-sidebar-foreground">
                  {label}
                </span>

                <span className="mt-0.5 text-caption leading-2 text-sidebar-foreground/60">
                  {sublabel}
                </span>
              </div>
            ),
          )}

          <p className="absolute bottom-0 left-0 flex items-center gap-1.5 text-caption text-text-disabled">
            <span className="size-1.5 rounded-full bg-accent" />
            Energy trading in progress · Live
          </p>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-2xl font-bold leading-tight text-white">
            Power your future,
            <br />
            one trade at a time
          </h2>

          <p className="mt-3 max-w-77.5 text-sm leading-[1.65] text-sidebar-foreground/70">
            Sign in to manage your clean-energy portfolio and trade directly
            with your local energy community.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {signInBenefits.map((benefit) => (
            <Benefit
              key={benefit.label}
              icon={benefit.icon}
              label={benefit.label}
            />
          ))}
        </div>

        <div className="mt-auto border-t border-sidebar-border pt-5">
          <p className="text-xs tracking-[0.18em] text-chart-3">★★★★★</p>

          <p className="mt-2 text-sm italic leading-6 text-sidebar-foreground/80">
            “{signInTestimonial.quote}”
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
              {signInTestimonial.initials}
            </span>

            <div>
              <p className="text-xs font-semibold text-white">
                {signInTestimonial.name}
              </p>

              <p className="text-caption leading-4 text-sidebar-foreground/55">
                {signInTestimonial.detail}
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
