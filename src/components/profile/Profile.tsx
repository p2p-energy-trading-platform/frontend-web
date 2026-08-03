import * as React from 'react'
import {
  Activity,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  EyeOff,
  Gauge,
  Link2,
  LockKeyhole,
  Mail,
  RadioTower,
  Save,
  ShieldCheck,
  UserRound,
  Zap,
} from 'lucide-react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Switch } from '#/components/ui/switch'
import type { KycStatus } from '#/components/auth/KycStep'
import { getKycStatus } from '#/lib/kyc-status'
import { getSmartMeterStatus } from '#/lib/smart-meter-status'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'
import { cn } from '#/lib/utils'

type Feedback = { tone: 'success' | 'error'; message: string } | null

type PersonalProfile = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  country: string
}

type TradingPreferences = {
  orderType: string
  priceMode: string
  energyLimit: string
  tradeValue: string
  recommendPrice: boolean
  dispatchAutomation: boolean
}

const PROFILE_STORAGE_KEY = 'gridx-personal-profile'
const TRADING_PREFERENCES_STORAGE_KEY = 'gridx-trading-preferences'

const defaultProfile: PersonalProfile = {
  fullName: 'Sara Al-Nuaimi',
  email: 'sara.alnuaimi@example.ae',
  countryCode: '+971',
  phone: '50 123 4567',
  country: 'United Arab Emirates',
}

const defaultTradingPreferences: TradingPreferences = {
  orderType: 'limit',
  priceMode: 'recommended',
  energyLimit: '450',
  tradeValue: '1000',
  recommendPrice: true,
  dispatchAutomation: false,
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return initials || 'U'
}

const user = {
  name: 'Sara Al-Nuaimi',
  role: 'Prosumer',
  initials: 'SA',
  property: 'Villa 47',
  zone: 'JLT Zone 4',
}

export default function Profile() {
  const [kycStatus, setKycStatus] = React.useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] =
    React.useState<SmartMeterStatus>('skipped')
  const [profile, setProfile] = React.useState<PersonalProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile

    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY)
      return savedProfile
        ? { ...defaultProfile, ...JSON.parse(savedProfile) }
        : defaultProfile
    } catch {
      return defaultProfile
    }
  })
  const [tradingPreferences, setTradingPreferences] =
    React.useState<TradingPreferences>(() => {
      if (typeof window === 'undefined') return defaultTradingPreferences

      try {
        const savedPreferences = window.localStorage.getItem(
          TRADING_PREFERENCES_STORAGE_KEY,
        )
        return savedPreferences
          ? { ...defaultTradingPreferences, ...JSON.parse(savedPreferences) }
          : defaultTradingPreferences
      } catch {
        return defaultTradingPreferences
      }
    })
  const [profileFeedback, setProfileFeedback] = React.useState<Feedback>(null)
  const [passwordFeedback, setPasswordFeedback] = React.useState<Feedback>(null)
  const [preferencesFeedback, setPreferencesFeedback] =
    React.useState<Feedback>(null)
  const [integrationFeedback, setIntegrationFeedback] =
    React.useState<Feedback>(null)
  const [showPasswords, setShowPasswords] = React.useState(false)

  React.useEffect(() => {
    setKycStatus(getKycStatus())
    setMeterStatus(getSmartMeterStatus())
  }, [])

  const kycStatusDetails = {
    'not-submitted': {
      value: 'Not submitted',
      description: 'Optional but increases limits',
      tone: 'neutral' as const,
    },
    pending: {
      value: 'Pending',
      description: 'Identity verification is awaiting review',
      tone: 'warning' as const,
    },
    verified: {
      value: 'Verified',
      description: 'Identity verified and higher limits available',
      tone: 'success' as const,
    },
  }[kycStatus]

  const meterStatusDetails =
    meterStatus === 'connected'
      ? {
          value: 'Connected',
          description: 'Smart meter is connected and reporting',
          tone: 'success' as const,
        }
      : {
          value: 'Pending',
          description: 'Connection request not approved yet',
          tone: 'warning' as const,
        }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
      setProfileFeedback({
        tone: 'success',
        message: 'Your profile information has been updated.',
      })
    } catch {
      setProfileFeedback({
        tone: 'error',
        message: 'We could not save your changes. Please try again.',
      })
    }
  }

  function updateProfile<TField extends keyof PersonalProfile>(
    field: TField,
    value: PersonalProfile[TField],
  ) {
    setProfile((current) => ({ ...current, [field]: value }))
    setProfileFeedback(null)
  }

  function updateTradingPreference<TField extends keyof TradingPreferences>(
    field: TField,
    value: TradingPreferences[TField],
  ) {
    setTradingPreferences((current) => ({ ...current, [field]: value }))
    setPreferencesFeedback(null)
  }

  function saveTradingPreferences(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      window.localStorage.setItem(
        TRADING_PREFERENCES_STORAGE_KEY,
        JSON.stringify(tradingPreferences),
      )
      setPreferencesFeedback({
        tone: 'success',
        message: 'Trading preferences saved.',
      })
    } catch {
      setPreferencesFeedback({
        tone: 'error',
        message: 'We could not save your preferences. Please try again.',
      })
    }
  }

  const profileUser = {
    ...user,
    name: profile.fullName,
    initials: getInitials(profile.fullName),
  }

  function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const current = String(values.get('currentPassword'))
    const next = String(values.get('newPassword'))
    const confirmation = String(values.get('confirmPassword'))

    if (current !== 'GridX123!') {
      setPasswordFeedback({
        tone: 'error',
        message: 'The current password you entered is incorrect.',
      })
      return
    }

    if (next !== confirmation) {
      setPasswordFeedback({
        tone: 'error',
        message: 'New password and confirmation do not match.',
      })
      return
    }

    setPasswordFeedback({
      tone: 'success',
      message: 'Your password has been updated securely.',
    })
    event.currentTarget.reset()
  }

  return (
    <div className="flex min-h-screen bg-bg-canvas text-text-primary">
      <div className="hidden lg:block">
        <Sidebar user={profileUser} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          propertyName={user.property}
          zoneLabel={user.zone}
          meterOnline={false}
          notificationCount={3}
          user={profileUser}
          dashboardHref="/dashboard"
        />

        <main className="mx-auto w-full max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-7 max-w-3xl">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              Profile settings
            </h1>
            <p className="mt-1 text-sm text-text-tertiary">
              Manage your account, security, trading preferences and connected
              services.
            </p>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle>Personal information</CardTitle>
                  <CardDescription>
                    Keep your contact and regional details up to date.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-bg-elevated p-4">
                    <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full border-[3px] border-[#5eead4]/30 bg-[#0ea592] text-base font-bold text-white shadow-md ring-4 ring-[#0ea592]/10">
                      {profileUser.initials}
                      <span
                        className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-[3px] border-bg-elevated bg-emerald-400 shadow-sm"
                        aria-label="Online"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-base font-semibold">
                        {profile.fullName}
                      </p>
                      <p className="text-sm text-text-tertiary">
                        Prosumer · Individual Account
                      </p>
                      <p className="mt-1 text-xs font-medium text-emerald-500">
                        Online
                      </p>
                    </div>
                  </div>

                  <form onSubmit={saveProfile} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name" htmlFor="fullName">
                        <Input
                          id="fullName"
                          name="fullName"
                          value={profile.fullName}
                          onChange={(event) =>
                            updateProfile('fullName', event.target.value)
                          }
                          autoComplete="name"
                          required
                        />
                      </Field>
                      <Field label="Email Address" htmlFor="email">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={(event) =>
                            updateProfile('email', event.target.value)
                          }
                          autoComplete="email"
                          required
                        />
                      </Field>
                      <Field label="Phone Number" htmlFor="phone">
                        <div className="grid grid-cols-[124px_minmax(0,1fr)] gap-2">
                          <Select
                            value={profile.countryCode}
                            onValueChange={(value) =>
                              updateProfile('countryCode', value ?? '')
                            }
                            name="countryCode"
                          >
                            <SelectTrigger
                              aria-label="Country code"
                              className="h-9 w-full"
                            >
                              <SelectValue>{profile.countryCode}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+971">UAE (+971)</SelectItem>
                              <SelectItem value="+60">
                                Malaysia (+60)
                              </SelectItem>
                              <SelectItem value="+94">
                                Sri Lanka (+94)
                              </SelectItem>
                              <SelectItem value="+65">
                                Singapore (+65)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(event) =>
                              updateProfile('phone', event.target.value)
                            }
                            autoComplete="tel-national"
                            required
                          />
                        </div>
                      </Field>
                      <Field label="Country / Region" htmlFor="country">
                        <Select
                          value={profile.country}
                          onValueChange={(value) =>
                            updateProfile('country', value ?? '')
                          }
                          name="country"
                        >
                          <SelectTrigger id="country" className="h-9 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United Arab Emirates">
                              United Arab Emirates
                            </SelectItem>
                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                            <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <FormActions
                      feedback={profileFeedback}
                      buttonLabel="Save Changes"
                    />
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <LockKeyhole className="size-4 text-brand-primary" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Use a unique password you do not use elsewhere.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updatePassword} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        ['Current Password', 'currentPassword'],
                        ['New Password', 'newPassword'],
                        ['Confirm Password', 'confirmPassword'],
                      ].map(([label, name]) => (
                        <Field key={name} label={label} htmlFor={name}>
                          <div className="relative">
                            <Input
                              id={name}
                              name={name}
                              type={showPasswords ? 'text' : 'password'}
                              required
                              minLength={8}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0.5 top-0.5"
                              aria-label={
                                showPasswords
                                  ? 'Hide passwords'
                                  : 'Show passwords'
                              }
                              onClick={() =>
                                setShowPasswords((shown) => !shown)
                              }
                            >
                              {showPasswords ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                        </Field>
                      ))}
                    </div>
                    <p className="text-xs text-text-tertiary">
                      Demo current password: GridX123!
                    </p>
                    <FormActions
                      feedback={passwordFeedback}
                      buttonLabel="Update password"
                    />
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-4 text-brand-primary" />
                    Trading preferences
                  </CardTitle>
                  <CardDescription>
                    Defaults are applied when you open the Trading Terminal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveTradingPreferences} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Default Order Type" htmlFor="orderType">
                        <Select
                          value={tradingPreferences.orderType}
                          onValueChange={(value) =>
                            updateTradingPreference('orderType', value ?? '')
                          }
                          name="orderType"
                        >
                          <SelectTrigger id="orderType" className="h-9 w-full">
                            <SelectValue>
                              {tradingPreferences.orderType === 'market'
                                ? 'Market order'
                                : 'Limit order'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limit">Limit order</SelectItem>
                            <SelectItem value="market">Market order</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Default Price Mode" htmlFor="priceMode">
                        <Select
                          value={tradingPreferences.priceMode}
                          onValueChange={(value) =>
                            updateTradingPreference('priceMode', value ?? '')
                          }
                          name="priceMode"
                        >
                          <SelectTrigger id="priceMode" className="h-9 w-full">
                            <SelectValue>
                              {tradingPreferences.priceMode === 'manual'
                                ? 'Manual price'
                                : tradingPreferences.priceMode === 'market'
                                  ? 'Market price'
                                  : 'Recommended price'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recommended">
                              Recommended price
                            </SelectItem>
                            <SelectItem value="manual">Manual price</SelectItem>
                            <SelectItem value="market">Market price</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Monthly Energy Limit" htmlFor="energyLimit">
                        <div className="relative">
                          <Input
                            id="energyLimit"
                            name="energyLimit"
                            type="number"
                            min="0"
                            value={tradingPreferences.energyLimit}
                            onChange={(event) =>
                              updateTradingPreference(
                                'energyLimit',
                                event.target.value,
                              )
                            }
                            required
                            className="pr-14"
                          />
                          <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-text-tertiary">
                            kWh
                          </span>
                        </div>
                      </Field>
                      <Field label="Max Trade Value" htmlFor="tradeValue">
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-2.5 text-xs text-text-tertiary">
                            RM
                          </span>
                          <Input
                            id="tradeValue"
                            name="tradeValue"
                            type="number"
                            min="0"
                            value={tradingPreferences.tradeValue}
                            onChange={(event) =>
                              updateTradingPreference(
                                'tradeValue',
                                event.target.value,
                              )
                            }
                            required
                            className="pl-10"
                          />
                        </div>
                      </Field>
                    </div>
                    <div className="divide-y divide-border rounded-xl border border-border">
                      <PreferenceToggle
                        id="recommendPrice"
                        icon={Gauge}
                        title="Auto-recommend sell price"
                        description="Suggest a price using live order book depth."
                        checked={tradingPreferences.recommendPrice}
                        onCheckedChange={(checked) =>
                          updateTradingPreference('recommendPrice', checked)
                        }
                      />
                      <PreferenceToggle
                        id="dispatchAutomation"
                        icon={Zap}
                        title="Allow dispatch automation"
                        description="Let GridX optimise battery and EV usage within your limits."
                        checked={tradingPreferences.dispatchAutomation}
                        onCheckedChange={(checked) =>
                          updateTradingPreference('dispatchAutomation', checked)
                        }
                      />
                    </div>
                    <FormActions
                      feedback={preferencesFeedback}
                      buttonLabel="Save preferences"
                    />
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="size-4 text-brand-primary" />
                    Integrations
                  </CardTitle>
                  <CardDescription>
                    Control external services that can access your GridX
                    account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="divide-y divide-border rounded-xl border border-border">
                    <IntegrationRow
                      icon={RadioTower}
                      name="Utility Smart Meter API"
                      description="Connection request not approved yet"
                      status="Pending approval"
                      action="Retry request"
                      tone="warning"
                    />
                    <IntegrationRow
                      icon={Mail}
                      name="Email delivery"
                      description="Account and trading notifications enabled"
                      status="Connected"
                      action="Manage"
                      tone="success"
                    />
                    <IntegrationRow
                      icon={CircleDollarSign}
                      name="Payment rail"
                      description="Connect a payment provider for settlements"
                      status="Not connected"
                      action="Connect"
                      tone="neutral"
                    />
                  </div>
                  <FormActions
                    feedback={integrationFeedback}
                    buttonLabel="Save settings"
                    onClick={() =>
                      setIntegrationFeedback({
                        tone: 'success',
                        message: 'Integration settings saved.',
                      })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-20">
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle>Account status</CardTitle>
                  <CardDescription>
                    Your current access and pending actions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                  <StatusRow
                    icon={UserRound}
                    label="Trading Mode"
                    value={user.role}
                    description={
                      user.role === 'Prosumer'
                        ? 'Can buy and sell verified energy'
                        : 'Can buy verified energy'
                    }
                    tone="success"
                  />
                  <StatusRow
                    icon={BadgeCheck}
                    label="KYC status"
                    {...kycStatusDetails}
                  />
                  <StatusRow
                    icon={Building2}
                    label="Smart meter"
                    {...meterStatusDetails}
                  />
                </CardContent>
              </Card>
              <div className="flex items-start gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary-muted p-4 text-sm">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-primary" />
                <p className="leading-5 text-text-secondary">
                  Your account information is encrypted and only shared with
                  services you approve.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function FormActions({
  feedback,
  buttonLabel,
  onClick,
}: {
  feedback: Feedback
  buttonLabel: string
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div aria-live="polite">
        {feedback ? (
          <p
            className={cn(
              'flex items-center gap-1.5 text-sm',
              feedback.tone === 'success'
                ? 'text-brand-primary'
                : 'text-destructive',
            )}
          >
            {feedback.tone === 'success' && <CheckCircle2 className="size-4" />}
            {feedback.message}
          </p>
        ) : null}
      </div>
      <Button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        className="gap-2 px-4"
      >
        <Save className="size-4" />
        {buttonLabel}
      </Button>
    </div>
  )
}

function StatusRow({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  description: string
  tone: 'success' | 'warning' | 'neutral'
}) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
        <Icon className="size-4 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{label}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
            <span
              aria-hidden="true"
              className={cn(
                'size-2 rounded-full',
                tone === 'success'
                  ? 'bg-brand-primary'
                  : tone === 'warning'
                    ? 'bg-brand-warning'
                    : 'bg-text-tertiary',
              )}
            />
            {value}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-text-tertiary">
          {description}
        </p>
      </div>
    </div>
  )
}

function PreferenceToggle({
  id,
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary-muted">
        <Icon className="size-4 text-brand-primary" />
      </div>
      <Label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-medium text-text-primary">
          {title}
        </span>
        <span className="mt-1 block text-xs font-normal text-text-tertiary">
          {description}
        </span>
      </Label>
      <Switch
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}

function IntegrationRow({
  icon: Icon,
  name,
  description,
  status,
  action,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  status: string
  action: string
  tone: 'success' | 'warning' | 'neutral'
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
        <Icon className="size-4.5 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="mt-1 text-xs text-text-tertiary">{description}</p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          tone === 'success' &&
            'border-brand-primary/30 bg-brand-primary-muted text-brand-primary',
          tone === 'warning' &&
            'border-brand-warning/30 bg-brand-warning-muted text-brand-warning',
          tone === 'neutral' && 'text-text-tertiary',
        )}
      >
        {status}
      </Badge>
      <Button type="button" variant="outline" size="sm">
        {action}
      </Button>
    </div>
  )
}
