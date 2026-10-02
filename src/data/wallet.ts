import { CURRENCY_CODE, formatAed } from '#/data/currency'
import type {
  BankAccount,
  PaymentCard,
  WalletTransaction,
} from '#/components/wallet/payment-types'

export const walletBalance = {
  available: formatAed(284.5),
  creditNote: `1 GridX credit = ${formatAed(1)} · balance shown in ${CURRENCY_CODE}`,
  pending: formatAed(7.74),
  reserved: formatAed(2.13),
  lifetimeIn: formatAed(1284.5),
  verificationNote:
    'Bank accounts are verified via two micro-deposits (AED 0.01–0.99). Verification typically takes 1–2 business days.',
}

export const paymentCards: Array<PaymentCard> = [
  {
    id: 'c1',
    last4: '4821',
    brand: 'visa',
    expiry: '09/27',
    verified: true,
    isDefault: true,
  },
  {
    id: 'c2',
    last4: '3802',
    brand: 'mastercard',
    expiry: '04/26',
    verified: true,
    isDefault: false,
  },
]

export const bankAccounts: Array<BankAccount> = [
  {
    id: 'b1',
    bankName: 'Emirates NBD',
    maskedIban: 'AE07 •••• •••• •••• 3917',
    last4: '3917',
    verified: true,
    verifiedAt: '12 May 2025',
    isDefault: true,
  },
  {
    id: 'b2',
    bankName: 'Abu Dhabi CIB',
    maskedIban: 'AE46 •••• •••• •••• 5204',
    last4: '5204',
    verified: false,
    isDefault: false,
  },
]

export const walletTransactions: Array<WalletTransaction> = [
  {
    title: 'Energy purchase',
    date: '07 Aug 2026 · 10:30 AM',
    amount: `- ${formatAed(25)}`,
    type: 'buy',
  },
  {
    title: 'Energy sold',
    date: '06 Aug 2026 · 04:15 PM',
    amount: `+ ${formatAed(42.5)}`,
    type: 'sell',
  },
]
