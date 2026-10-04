import { BalanceHero } from '#/components/wallet/BalanceHero';
import { TransactionHistory } from '#/components/wallet/TransactionHistory';
import { PaymentMethods } from '#/components/wallet/PaymentMethods.tsx';

export default function WalletView() {
  return (
    <main className="mx-auto flex w-full flex-col gap-5 p-6">
      <BalanceHero />

      <div className="flex w-full flex-col gap-7 lg:flex-row">
        <TransactionHistory />
        <PaymentMethods />
      </div>
    </main>
  );
}
