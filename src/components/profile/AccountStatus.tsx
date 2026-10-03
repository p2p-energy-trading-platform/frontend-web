import { BadgeCheck, Building2, ShieldCheck, UserRound } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { cn } from 'cn'

export default function AccountStatus() {
  return (
    <>
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
            value="Prosumer"
            description="Can buy and sell verified energy"
            tone="success"
          />
          <StatusRow
            icon={BadgeCheck}
            label="KYC status"
            value="Pending"
            description="Identity verified and higher limits available"
            tone="success"
          />
          <StatusRow
            icon={Building2}
            label="Smart meter"
            value="Connected"
            description="Smart meter is connected and reporting"
            tone="success"
          />
        </CardContent>
      </Card>
      <div className="flex items-start gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary-muted p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-primary" />
        <p className="leading-5 text-text-secondary">
          Your account information is encrypted and only shared with services
          you approve.
        </p>
      </div>
    </>
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
  tone: 'success' | 'warning'
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
                tone === 'success' ? 'bg-brand-primary' : 'bg-brand-warning',
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
