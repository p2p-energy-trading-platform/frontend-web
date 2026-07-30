import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  IdCard,
  MailCheck,
  RadioTower,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import type { KycStatus } from '#/components/auth/KycStep'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'
import { Badge } from '#/components/ui/badge'
import { getKycStatus } from '#/lib/kyc-status'
import { getSmartMeterStatus } from '#/lib/smart-meter-status'
import { cn } from '#/lib/utils'

export default function Profile() {
  const [kycStatus, setKycStatus] = React.useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] =
    React.useState<SmartMeterStatus>('skipped')

  React.useEffect(() => {
    setKycStatus(getKycStatus())
    setMeterStatus(getSmartMeterStatus())
  }, [])

  const isPending = kycStatus === 'pending'
  const isMeterPending = meterStatus === 'pending'

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-8">
      <div className="mx-auto max-w-[920px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
              Account settings
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-sm text-text-tertiary">
              Manage your GridX identity and account verification.
            </p>
          </div>

          <Badge className="w-fit gap-1.5 border-accent/20 bg-accent/10 px-3 py-1.5 text-accent">
            <ShieldCheck className="size-3.5" />
            Secure account
          </Badge>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-4 border-b border-border px-5 py-5 sm:px-6">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <UserRound className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-semibold">GridX User</h2>
              <p className="mt-0.5 text-sm text-text-tertiary">
                Personal trading account
              </p>
            </div>
          </div>

          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <ProfileItem
              icon={MailCheck}
              label="Email verification"
              value="Verified"
              valueClassName="text-[var(--feedback-success-text)]"
            />
            <ProfileItem
              icon={IdCard}
              label="KYC verification"
              value={isPending ? 'Pending' : 'Not submitted'}
              valueClassName={
                isPending
                  ? 'text-[var(--feedback-warning-text)]'
                  : 'text-text-tertiary'
              }
            />
            <ProfileItem
              icon={RadioTower}
              label="Smart meter"
              value={isMeterPending ? 'Pending' : 'Not connected'}
              valueClassName={
                isMeterPending
                  ? 'text-[var(--feedback-warning-text)]'
                  : 'text-text-tertiary'
              }
            />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-2xl',
                isPending
                  ? 'bg-[var(--feedback-warning-background)] text-[var(--feedback-warning-text)]'
                  : 'bg-secondary text-text-tertiary',
              )}
            >
              {isPending ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-lg font-semibold">
                  Identity verification
                </h2>
                <StatusBadge status={kycStatus} />
              </div>

              <p className="mt-2 max-w-[650px] text-sm leading-6 text-text-tertiary">
                {isPending
                  ? 'Your identity documents were submitted and are awaiting review. We will update this status when verification is complete.'
                  : 'KYC has not been submitted. You can verify your identity later to unlock higher trading limits and wallet payouts.'}
              </p>

              {!isPending ? (
                <Link
                  to="/sign-up"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  Complete KYC
                  <ChevronRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ProfileItem({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
      <Icon className="size-4 text-accent" />
      <div>
        <p className="text-xs text-text-tertiary">{label}</p>
        <p className={cn('mt-0.5 text-sm font-semibold', valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: KycStatus }) {
  const isPending = status === 'pending'

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold',
        isPending
          ? 'bg-[var(--feedback-warning-background)] text-[var(--feedback-warning-text)]'
          : 'bg-secondary text-text-tertiary',
      )}
    >
      {isPending ? 'Pending' : 'Not submitted'}
    </span>
  )
}
