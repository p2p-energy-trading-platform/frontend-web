import {
  bankAccounts,
  paymentCards,
  walletBalance,
  walletTransactions,
} from '#/data/wallet'

export function useWallet() {
  return {
    source: 'demo' as const,
    balance: walletBalance,
    cards: paymentCards,
    accounts: bankAccounts,
    transactions: walletTransactions,
  }
}
