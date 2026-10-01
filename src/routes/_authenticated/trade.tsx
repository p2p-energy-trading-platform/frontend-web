import { createFileRoute } from '@tanstack/react-router'

import { TradingTerminal } from '#/components/trade/TradingTerminal'

export const Route = createFileRoute('/_authenticated/trade')({
  component: TradingTerminal,
})
