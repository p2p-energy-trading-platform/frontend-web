import { Card, CardContent } from '#/components/ui/card';
import { useWallet } from '#/hooks/useWallet';
import { BalanceOverview } from './BalanceOverview';
import { BalanceMetrics } from './BalanceMetrics';
import { BalanceActions } from './BalanceActions';

export function BalanceHero() {
  const wallet = useWallet();

  return (
    <Card className=" p-5" data-source={wallet.source}>
      <CardContent className="flex flex-col gap-5">
        <BalanceOverview
          available={wallet.balance.available}
          creditNote={wallet.balance.creditNote}
        />

        <BalanceMetrics
          pending={wallet.balance.pending}
          reserved={wallet.balance.reserved}
          lifetimeIn={wallet.balance.lifetimeIn}
        />

        <BalanceActions />
      </CardContent>
    </Card>
  );
}
