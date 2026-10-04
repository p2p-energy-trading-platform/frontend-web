import HomeView from '#/components/landing/HomeView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/')({
  component: HomeView,
})
