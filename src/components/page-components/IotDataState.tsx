import { AlertTriangle, Gauge, Hourglass } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { EmptyState } from '#/components/ui/empty-state';
import { Skeleton } from '#/components/ui/skeleton';
import type { IotStatus } from '#/features/iot/status';
import { cn } from 'cn';

export interface IotDataStateProps {
  status: Exclude<IotStatus, 'ready'>;
  onRetry?: () => void;
  /** Height of the loading placeholder, matching the card it stands in for. */
  skeletonClassName?: string;
}

/** The loading, empty and error states shared by every IoT card. */
export function IotDataState({
  status,
  onRetry,
  skeletonClassName,
}: IotDataStateProps) {
  if (status === 'loading') {
    return <Skeleton className={cn('h-40 w-full', skeletonClassName)} />;
  }
  if (status === 'no-house') {
    return (
      <EmptyState
        icon={Gauge}
        title="No smart meter linked yet"
        description="Link your smart meter to see your energy data here."
      />
    );
  }
  if (status === 'no-reading') {
    return (
      <EmptyState
        icon={Hourglass}
        title="Waiting for first reading"
        description="Your smart meter has not sent any data yet."
      />
    );
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Couldn't load this data"
      description="Something went wrong while loading your energy data."
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  );
}
