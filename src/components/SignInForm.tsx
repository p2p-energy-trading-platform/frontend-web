import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BatteryCharging,
  Eye,
  EyeOff,
  Gauge,
  House,
  Leaf,
  Sun,
  Users,
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
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#0c1424] text-[#e2eaf4]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex justify-center bg-[#0c1424] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full max-w-[420px]">
            <header>
              <h1 className="font-heading text-2xl font-bold leading-8">
                Welcome back
              </h1>

              <p className="mt-1.5 text-sm text-[#7a90a8]">
                Sign in to your GridX account
              </p>
            </header>

            <form onSubmit={handleSignIn} className="mt-7">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-[0.025em] text-[#a8bdd4]"
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
                  className="mt-1.5 h-12 rounded-2xl border-[#94b4dc23] bg-[#1c2e48] px-4 text-sm text-[#e2eaf4] shadow-none placeholder:text-[#4a5f78] focus-visible:border-[#0ea592] focus-visible:ring-[#0ea592]/20"
                  required
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-[0.025em] text-[#a8bdd4]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#0ea592] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-2xl border-[#94b4dc23] bg-[#1c2e48] px-4 pr-12 text-sm text-[#e2eaf4] shadow-none placeholder:text-[#4a5f78] focus-visible:border-[#0ea592] focus-visible:ring-[#0ea592]/20"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-0 top-0 flex size-12 items-center justify-center text-[#4a5f78] transition hover:text-[#a8bdd4]"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-4">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.currentTarget.checked)
                  }
                  className="size-5 rounded-[10px] border-2 border-[#94b4dc23] bg-transparent data-[state=checked]:border-[#0ea592] data-[state=checked]:bg-[#0ea592]"
                />

                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-[#a8bdd4]"
                >
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                disabled={!email || !password}
                className="h-12 w-full rounded-xl bg-[#0ea592] text-base font-semibold text-white hover:bg-[#0c9483] disabled:bg-[#124b48] disabled:text-[#7a90a8]"
              >
                Sign in
              </Button>

              <div className="my-6 flex items-center gap-3 text-xs font-medium text-[#4a5f78]">
                <span className="h-px flex-1 bg-[#94b4dc0f]" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-[#94b4dc0f]" />
              </div>

              <button
                type="button"
                className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[#94b4dc19] bg-[#152035] px-4 text-sm font-semibold transition hover:border-[#94b4dc2d] hover:bg-[#1a2840]"
              >
                <span className="flex h-[18px] w-7 overflow-hidden rounded-sm">
                  <span className="w-1/3 bg-[#ef3340]" />
                  <span className="w-1/3 bg-white" />
                  <span className="w-1/3 bg-[#009739]" />
                </span>

                <span className="flex-1 text-left">UAE PASS</span>

                <span className="rounded-full bg-[#94b4dc19] px-2 py-0.5 font-mono text-[10px] font-medium text-[#c8d6e8]">
                  UAE Digital ID
                </span>

                <ArrowRight className="size-3.5 text-[#7a90a8]" />
              </button>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#94b4dc19] bg-[#152035] text-sm font-semibold transition hover:bg-[#1a2840]"
                >
                  <span className="text-base font-bold text-[#4285f4]">G</span>
                  Google
                </button>

                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#94b4dc19] bg-[#152035] text-sm font-semibold transition hover:bg-[#1a2840]"
                >
                  <span className="grid size-4 grid-cols-2 gap-px">
                    <span className="bg-[#f25022]" />
                    <span className="bg-[#7fba00]" />
                    <span className="bg-[#00a4ef]" />
                    <span className="bg-[#ffb900]" />
                  </span>
                  Microsoft
                </button>
              </div>

              <p className="mt-2.5 text-center text-[10px] text-[#4a5f78]">
                These options may not yet be available in all regions.
              </p>

              <p className="mt-6 text-center text-sm text-[#7a90a8]">
                Don&apos;t have an account?{' '}
                <Link
                  to="/sign-up"
                  className="font-semibold text-[#0ea592] hover:underline"
                >
                  Create account
                </Link>
              </p>

              <div className="mt-5 border-t border-[#94b4dc0f] pt-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#4a5f78]">
                  Demo shortcut
                </p>

                <Link
                  to="/"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0ea592] hover:underline"
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
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#080f1e] px-10 py-10 lg:block">
      <div className="absolute -top-28 right-0 size-[500px] rounded-full bg-[#0ea592]/10 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/[0.07] blur-[90px]" />

      <div className="relative mx-auto flex h-full max-w-[590px] flex-col">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[#0ea592] text-white">
            <Zap className="size-[18px] fill-current" />
          </span>

          <span className="font-heading text-xl font-bold text-white">
            GridX
          </span>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] text-emerald-300">
            Beta
          </span>
        </div>

        <div className="relative mx-auto mt-8 h-[300px] w-full max-w-[520px]">
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 520 300"
            aria-hidden="true"
          >
            <g stroke="#0ea592" strokeDasharray="5 6" strokeOpacity=".38">
              <line x1="260" y1="150" x2="80" y2="55" />
              <line x1="260" y1="150" x2="260" y2="30" />
              <line x1="260" y1="150" x2="440" y2="55" />
              <line x1="260" y1="150" x2="80" y2="245" />
              <line x1="260" y1="150" x2="260" y2="275" />
              <line x1="260" y1="150" x2="440" y2="245" />
            </g>
          </svg>

          <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#0ea592] bg-[#092c33] text-[#0ea592] shadow-[0_0_50px_rgba(14,165,146,.18)]">
            <Zap className="size-5 fill-current" />
            <span className="mt-1 text-[8px] font-bold">GRIDX</span>
          </div>

          {networkNodes.map(({ label, sublabel, icon: Icon, className }) => (
            <div
              key={label}
              className={`absolute flex size-16 flex-col items-center justify-center rounded-full border border-[#0ea592]/45 bg-[#152035] text-center ${className}`}
            >
              <Icon className="size-3.5 text-[#0ea592]" />

              <span className="mt-1 text-[8px] font-semibold text-[#a8bdd4]">
                {label}
              </span>

              <span className="text-[6px] text-[#4a5f78]">{sublabel}</span>
            </div>
          ))}

          <p className="absolute bottom-0 left-0 flex items-center gap-1.5 text-[8px] text-[#4a5f78]">
            <span className="size-1.5 rounded-full bg-[#0ea592]" />
            Energy trading in progress · Live
          </p>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-2xl font-bold leading-[1.25] text-white">
            Your energy,
            <br />
            your neighbourhood
          </h2>

          <p className="mt-3 max-w-[310px] text-sm leading-[1.65] text-[#c8d6e8]/55">
            Trade surplus solar, battery, and EV energy directly with households
            in your Dubai grid zone.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <Metric icon={Gauge} value="~4 min" label="Average settlement" />
          <Metric icon={Users} value="3,412" label="Active prosumers" />
          <Metric icon={Leaf} value="61,840" label="kWh traded / month" />
        </div>

        <div className="mt-auto border-t border-[#94b4dc14] pt-5">
          <p className="text-xs tracking-[0.18em] text-[#ffb900]">★★★★★</p>

          <p className="mt-2 text-sm italic text-[#c8d6e8]/60">
            “Sold 18 kWh this month to neighbours — earned more than my
            electricity bill.”
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#0ea592]/20 text-xs font-bold text-[#0ea592]">
              SA
            </span>

            <div>
              <p className="text-xs font-semibold text-white">Sara A.</p>

              <p className="text-[10px] text-[#c8d6e8]/35">
                Solar prosumer · JLT Zone 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-xl border border-[#0ea592]/20 bg-[#0ea592]/15 text-[#0ea592]">
        <Icon className="size-3.5" />
      </span>

      <div>
        <p className="font-mono text-sm font-bold text-white">{value}</p>
        <p className="text-xs text-[#c8d6e8]/45">{label}</p>
      </div>
    </div>
  )
}
