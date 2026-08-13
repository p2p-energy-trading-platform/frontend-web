import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  Battery,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  CloudSun,
  FileWarning,
  ShieldCheck,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { NotificationFilterBar } from '#/components/notification/Notificationfilterbar'
import type { NotificationCategory } from '#/components/notification/Notificationfilterbar'
import { NotificationFeed } from '#/components/notification/Notificationfeed'

export const Route = createFileRoute('/notification')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const user = {
    name: 'Sara A.',
    role: 'Prosumer',
    initials: 'SA',
    property: 'Villa 47',
    zone: 'JLT Zone 4',
  }

  const [category, setCategory] = useState<NotificationCategory>('All')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          propertyName="Villa 47"
          zoneLabel="JLT Zone 4"
          meterOnline
          notificationCount={3}
          user={user}
        />

        <main className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-heading-2 text-text-primary">Notifications</h1>
            <span className="flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
              3
            </span>
          </div>

          <NotificationFilterBar
            category={category}
            onCategoryChange={setCategory}
            counts={{
              All: 3,
              Trading: 1,
              Wallet: 1,
              'Meter & assets': 1,
            }}
          />

          <NotificationFeed
            groups={[
              {
                dateLabel: 'Today',
                items: [
                  {
                    id: '1',
                    icon: CheckCircle2,
                    iconClassName: 'bg-accent/15 text-accent',
                    title: 'Order GX-2847 filled',
                    time: '14:32 GST',
                    description:
                      'Your sell order for 8.4 kWh at AED 0.380/kWh has been fully matched and settled. AED 3.19 credited to your wallet.',
                    actionLabel: 'View trade',
                    unread: true,
                  },
                  {
                    id: '2',
                    icon: Wallet,
                    iconClassName: 'bg-chart-4/15 text-chart-4',
                    title: 'Withdrawal submitted',
                    time: '13:55 GST',
                    description:
                      'Your AED 150.00 withdrawal to Emirates NBD ••3917 is being processed. Funds arrive in 1–3 business days.',
                    actionLabel: 'View wallet',
                    unread: true,
                  },
                  {
                    id: '3',
                    icon: AlertTriangle,
                    iconClassName: 'bg-chart-3/15 text-chart-3',
                    title: 'Smart meter offline',
                    time: '12:08 GST',
                    description:
                      'Your meter SM-784-20241105 at Villa 47 has not synced for 22 minutes. Live trading and export data may be delayed.',
                    actionLabel: 'View asset',
                    unread: true,
                  },
                  {
                    id: '4',
                    icon: Bell,
                    iconClassName: 'bg-chart-3/15 text-chart-3',
                    title: 'Price alert triggered',
                    time: '11:30 GST',
                    description:
                      'Market price reached AED 0.390/kWh in your delivery zone — above your alert threshold of AED 0.385/kWh.',
                    actionLabel: 'Go to Trade',
                  },
                  {
                    id: '5',
                    icon: CloudSun,
                    iconClassName: 'bg-chart-4/15 text-chart-4',
                    title: "Tomorrow's forecast updated",
                    time: '08:00 GST',
                    description:
                      '18 Jul forecast now available. Predicted peak: AED 0.418/kWh at 18:30 GST. High solar generation expected until 15:00.',
                    actionLabel: 'View forecast',
                  },
                ],
              },
              {
                dateLabel: 'Yesterday',
                items: [
                  {
                    id: '6',
                    icon: ShieldCheck,
                    iconClassName: 'bg-accent/15 text-accent',
                    title: 'KYC approved',
                    time: '16 Jul · 09:14',
                    description:
                      'Your identity documents have been reviewed and approved. Full trading, deposit, and withdrawal access is now active.',
                    actionLabel: 'Start trading',
                  },
                  {
                    id: '7',
                    icon: Zap,
                    iconClassName: 'bg-accent/15 text-accent',
                    title: 'Trade GX-2831 settled',
                    time: '16 Jul · 15:44',
                    description:
                      '11.2 kWh sold at AED 0.385/kWh. Net proceeds AED 4.31 credited after grid fee. Total fees paid: AED 0.18.',
                  },
                  {
                    id: '8',
                    icon: Wallet,
                    iconClassName: 'bg-chart-4/15 text-chart-4',
                    title: 'Deposit confirmed',
                    time: '16 Jul · 09:18',
                    description:
                      'AED 200.00 deposited via Visa ••4821. Balance updated. Processing fee AED 2.40 deducted.',
                    actionLabel: 'View wallet',
                  },
                  {
                    id: '9',
                    icon: Zap,
                    iconClassName: 'bg-secondary text-text-secondary',
                    title: 'Solar meter sync complete',
                    time: '16 Jul · 06:01',
                    description:
                      "SM-784-20241105 successfully synced at 06:00 GST. Yesterday's generation total: 28.4 kWh.",
                  },
                  {
                    id: '10',
                    icon: Clock,
                    iconClassName: 'bg-chart-3/15 text-chart-3',
                    title: 'Open order expiring in 15 minutes',
                    time: '15 Jul · 08:45',
                    description:
                      'Sell order GX-2840 (10 kWh at AED 0.410/kWh, slot 09:00–09:30) will expire if not matched.',
                    actionLabel: 'Manage order',
                  },
                ],
              },
              {
                dateLabel: 'Earlier',
                items: [
                  {
                    id: '11',
                    icon: FileWarning,
                    iconClassName: 'bg-destructive/15 text-destructive',
                    title: 'Document resubmission required',
                    time: '12 Jul · 11:20',
                    description:
                      'Your Emirates ID scan was unclear. Please resubmit a high-resolution copy within 5 business days to maintain account access.',
                    actionLabel: 'Upload document',
                  },
                  {
                    id: '12',
                    icon: Calendar,
                    iconClassName: 'bg-chart-4/15 text-chart-4',
                    title: 'Weekly forecast published',
                    time: '14 Jul · 07:00',
                    description:
                      'Zone 4 price outlook for 14–20 Jul is now live. Average predicted AED 0.374/kWh with elevated demand Friday afternoon.',
                    actionLabel: 'View forecast',
                  },
                  {
                    id: '13',
                    icon: Battery,
                    iconClassName: 'bg-accent/15 text-accent',
                    title: 'Battery health alert',
                    time: '10 Jul · 14:00',
                    description:
                      'EV Home Charger reports 94% state of health — within normal range. Next diagnostic: 14 Aug 2025.',
                  },
                  {
                    id: '14',
                    icon: Wrench,
                    iconClassName: 'bg-secondary text-text-secondary',
                    title: 'Scheduled maintenance',
                    time: '08 Jul · 16:00',
                    description:
                      'GridX platform maintenance is scheduled for 20 Jul 02:00–04:00 GST. Trading will be paused during this window.',
                  },
                  {
                    id: '15',
                    icon: Zap,
                    iconClassName: 'bg-accent/15 text-accent',
                    title: 'Welcome to GridX',
                    time: '01 Jun · 08:00',
                    description:
                      'Your account is active. Complete your smart meter setup to start buying and selling solar energy with your neighbours.',
                    actionLabel: 'Set up meter',
                  },
                ],
              },
            ]}
          />
        </main>
      </div>
    </div>
  )
}
