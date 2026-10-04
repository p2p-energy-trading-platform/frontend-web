import DashboardView from '#/components/dashboard/DashboardView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardView,
});
