import { createFileRoute } from '@tanstack/react-router'

import Profile from '#/components/profile/Profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})
