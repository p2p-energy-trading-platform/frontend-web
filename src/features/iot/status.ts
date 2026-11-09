export type IotStatus =
  'loading' | 'no-house' | 'no-reading' | 'error' | 'ready';

export interface IotStatusInput {
  housesLoading: boolean;
  housesFailed: boolean;
  hasHouse: boolean;
  /** The card's own query is loading. */
  loading: boolean;
  failed: boolean;
  /** The query succeeded but the meter has not reported yet. */
  missing: boolean;
}

/** What an IoT card should show, from the house lookup and its own query. */
export function iotStatus(input: IotStatusInput): IotStatus {
  if (input.housesLoading) return 'loading';
  if (input.housesFailed) return 'error';
  if (!input.hasHouse) return 'no-house';
  if (input.failed) return 'error';
  if (input.loading) return 'loading';
  if (input.missing) return 'no-reading';
  return 'ready';
}
