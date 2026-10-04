import { createFileRoute } from '@tanstack/react-router'

import TradingTerminalView from '#/components/trade/TradingTerminalView'

export const Route = createFileRoute('/_authenticated/trade')({
  component: TradingTerminalView,
})
