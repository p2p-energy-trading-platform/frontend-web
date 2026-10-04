import HistoryView from '#/components/history/HistoryView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/history')({
  component: HistoryView,
});
