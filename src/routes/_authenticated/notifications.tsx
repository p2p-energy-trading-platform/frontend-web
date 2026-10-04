import NotificationView from '#/components/notification/NotificationView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notifications')({
  component: NotificationView,
})