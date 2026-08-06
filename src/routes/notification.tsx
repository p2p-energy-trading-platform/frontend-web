import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'

export const Route = createFileRoute('/notification')({
  component: Notification,
})

function Notification() {
  
const user = {
    name: 'Sara A.',
    role: 'Prosumer',
    initials: 'SA',
    property: 'Villa 47',
    zone: 'JLT Zone 4',
  }

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
        </div>
    </div>

  )

}
