export type CardBrand = "visa" | "mastercard" | "amex";


export interface PaymentCard {
   id: string; last4: string; brand: CardBrand; expiry: string;
   verified: boolean; isDefault: boolean;
}

export interface BankAccount {
   id: string; bankName: string; maskedIban: string; last4: string;
   verified: boolean; verifiedAt?: string; isDefault: boolean;
}




export const SAMPLE_CARDS: PaymentCard[] = [
   { id:"c1", last4:"4821", brand:"visa",       expiry:"09/27", verified:true,  isDefault:true  },
   { id:"c2", last4:"3802", brand:"mastercard", expiry:"04/26", verified:true,  isDefault:false },
];

export const SAMPLE_ACCOUNTS: BankAccount[] = [
   { id:"b1", bankName:"Emirates NBD",  maskedIban:"AE07 •••• •••• •••• 3917", last4:"3917", verified:true,  verifiedAt:"12 May 2025", isDefault:true  },
   { id:"b2", bankName:"Abu Dhabi CIB", maskedIban:"AE46 •••• •••• •••• 5204", last4:"5204", verified:false, isDefault:false },
];