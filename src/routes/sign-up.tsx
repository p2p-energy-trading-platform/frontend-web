import { createFileRoute } from '@tanstack/react-router'

import SignupView from '#/components/auth/SignupView'

export const Route = createFileRoute('/sign-up')({
  component: SignupView,
})
