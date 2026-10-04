import AboutView from '#/components/landing/AboutView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_marketing/about')({
  component: AboutView,
});
