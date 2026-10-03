import * as React from 'react'
import {
  Activity,
  BadgeCheck,
  Building2,
  CircleDollarSign,
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

import { Avatar, AvatarBadge, AvatarFallback } from '#/components/ui/avatar'
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
import { cn } from 'cn'
import { useProfile } from '#/hooks/useProfile'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { PasswordInput } from '../ui/password-input'

export default function Profile() {
  const profileState = useProfile()
  const {
    user,
    kycStatus,
    meterStatus,
    countries,
    countryCodes,
    tradeValueCurrency,
    source,
  } = profileState

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

  const profileUser = {
    ...user,
  }

  return (
    <main
      className="mx-auto w-full max-w-340 bg-bg-canvas px-4 py-6 text-text-primary sm:px-6 lg:px-8 lg:py-8"
      data-source={source}
    >
      <div className="mb-7 max-w-3xl">
        <h1 className="font-heading text-heading-1">Profile settings</h1>
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
                <Avatar className="size-16 border-[3px] border-accent/30 bg-accent shadow-md ring-4 ring-accent/10">
                  <AvatarFallback className="bg-accent text-base font-bold text-accent-foreground">
                    {profileUser.initials}
                  </AvatarFallback>
                  <AvatarBadge
                    className="size-3.5 border-[3px] border-bg-elevated bg-feedback-success-icon"
                    aria-label="Online"
                  />
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-semibold">
                    Name
                  </p>
                  <p className="text-sm text-text-tertiary">
                    Prosumer · Individual Account
                  </p>
                  <p className="mt-1 text-xs font-medium text-feedback-success-text">
                    Online
                  </p>
                </div>
              </div>

              <form className="space-y-5">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                      <Input
                        id="fullName"
                        name="fullName"
                  
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='email'>Email</FieldLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor='phone'>Phone</FieldLabel>
                      <div className="grid grid-cols-[124px_minmax(0,1fr)] gap-2">
                        <Select
                          name="countryCode"
                        >
                          <SelectTrigger
                            aria-label="Country code"
                            className="h-9 w-full"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                        />
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='country'>Country / Region</FieldLabel>
                      <Select
                        name="country"
                      >
                        <SelectTrigger id="country" className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field orientation="horizontal">
                    <Button className="px-4">
                      <Save className="size-4" />
                      Save
                    </Button>
                  </Field>
                </FieldGroup>
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
              <form className="space-y-5">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field>
                      <FieldLabel htmlFor='name'>Current Password</FieldLabel>
                      <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        required
                        minLength={8}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='name'>New Password</FieldLabel>
                      <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        required
                        minLength={8}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='name'>Confirm Password</FieldLabel>
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength={8}
                      />
                    </Field>
                  </div>
                  <Field orientation="horizontal">
                    <Button className="px-4">
                      <Save className="size-4" />
                      Save
                    </Button>
                  </Field>
                </FieldGroup>
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
              <form className="space-y-5">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor='orderType'>Default Order Type</FieldLabel>
                      <Select
                        name="orderType"
                      >
                        <SelectTrigger id="orderType" className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="limit">Limit order</SelectItem>
                          <SelectItem value="market">Market order</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='priceMode'>Default Price Mode</FieldLabel>
                      <Select
                        name="priceMode"
                      >
                        <SelectTrigger id="priceMode" className="h-9 w-full">
                          <SelectValue />
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
                    <Field>
                      <FieldLabel htmlFor='energyLimit'>Monthly Energy Limit</FieldLabel>
                      <div className="relative">
                        <Input
                          id="energyLimit"
                          name="energyLimit"
                          type="number"
                          min="0"
                          required
                          className="pr-14"
                        />
                        <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-text-tertiary">
                          kWh
                        </span>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="tradeValue">Max Trade Value</FieldLabel>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-2.5 text-xs text-text-tertiary">
                          {tradeValueCurrency}
                        </span>
                        <Input
                          id="tradeValue"
                          name="tradeValue"
                          type="number"
                          min="0"
                          required
                          className="pl-10"
                        />
                      </div>
                    </Field>
                  </div>

                </FieldGroup>
                <div className="divide-y divide-border rounded-xl border border-border">
                  <PreferenceToggle
                    id="recommendPrice"
                    icon={Gauge}
                    title="Auto-recommend sell price"
                    description="Suggest a price using live order book depth."
                  />
                  <PreferenceToggle
                    id="dispatchAutomation"
                    icon={Zap}
                    title="Allow dispatch automation"
                    description="Let GridX optimise battery and EV usage within your limits."
                  />
                </div>
                <FormActions
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
                Control external services that can access your GridX account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border rounded-xl border border-border">
                <IntegrationRow
                  icon={RadioTower}
                  name='Utility Smart Meter API'
                  description='Connection request not approved yet'
                  status='completed'
                />
                <IntegrationRow
                  icon={Mail}
                  name='Email delivery'
                  description='Account and trading notifications enabled'
                  status='completed'
                />
                <IntegrationRow
                  icon={CircleDollarSign}
                  name='Payment rail'
                  description='Connect a payment provider for settlements'
                  status='completed'
                />
              </div>
              <FormActions
                buttonLabel="Save settings"
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
                description="Can buy and sell verified energy"
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
  )
}

function FormActions({
  buttonLabel,
  onClick,
}: {
  buttonLabel: string
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
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
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
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
      />
    </div>
  )
}

function IntegrationRow({
  icon: Icon,
  name,
  description,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  status: 'pending' | 'completed'
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
        variant={status === 'completed' ? "default" : "destructive"}
      >
        {status}
      </Badge>
      <Button type="button" variant="outline">
        {status === 'completed' ? 'manage' : 'connect'}
      </Button>
    </div>
  )
}
