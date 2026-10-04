import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '#/components/ui/card';

type Props = {
  icon: LucideIcon;
  title: string;
  amount: string;
  description: string;
};

export function BalanceMetricCard({
  icon: Icon,
  title,
  amount,
  description,
}: Props) {
  return (
    <Card className="flex-1">
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-start gap-2">
          <Icon className="size-5 text-text-secondary" />

          <h5 className="text-text-secondary">{title}</h5>
        </div>

        <div className="">
          <h3 className="text-heading-2 lg:text-heading-4">{amount}</h3>
        </div>

        <div className="">
          <p className="text-caption text-text-secondary">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
