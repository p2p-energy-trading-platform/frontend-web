import { createFileRoute } from '@tanstack/react-router';

import { TradesTab } from '#/components/history/TradeHistory';

export const Route = createFileRoute('/_authenticated/history/trades')({
  component: TradeHistoryPage,
});

function TradeHistoryPage() {
  return <TradesTab state="populated" />;
}
