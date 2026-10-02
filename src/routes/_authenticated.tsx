import { Outlet, createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/page-components/Header'
import Sidebar, { MobileNavButton } from '#/components/page-components/Sidebar'

const user = {
  name: 'Sara A.',
  role: 'Prosumer',
  initials: 'SA',
  property: 'Villa 47',
  zone: 'JLT Zone 4',
}

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          leading={<MobileNavButton user={user} />}
          propertyName={user.property}
          zoneLabel={user.zone}
          meterOnline
          notificationCount={3}
          user={user}
        />
        <Outlet />
      </div>
    </div>
  )
}
