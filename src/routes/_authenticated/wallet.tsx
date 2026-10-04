import WalletView from '#/components/wallet/WalletView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/wallet')({
  component: WalletView,
})
