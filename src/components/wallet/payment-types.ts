export type CardBrand = 'visa' | 'mastercard' | 'amex';

export interface PaymentCard {
  id: string;
  last4: string;
  brand: CardBrand;
  expiry: string;
  verified: boolean;
  isDefault: boolean;
}

export interface BankAccount {
  id: string;
  bankName: string;
  maskedIban: string;
  last4: string;
  verified: boolean;
  verifiedAt?: string;
  isDefault: boolean;
}

export interface WalletTransaction {
  title: string;
  date: string;
  amount: string;
  type: 'buy' | 'sell';
}
