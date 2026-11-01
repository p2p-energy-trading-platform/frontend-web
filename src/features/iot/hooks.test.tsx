// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '#/lib/api-client';
import { getEnergySummary, getLatestReading, listHouses } from './api';
import type { House } from './api';
import {
  resolveSelectedHouse,
  useEnergySummary,
  useLatestReading,
  useSelectedHouse,
} from './hooks';
import { useSelectedHouseStore } from './selected-house-store';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

vi.mock('./api', () => ({
  listHouses: vi.fn(),
  getHouse: vi.fn(),
  getLatestReading: vi.fn(),
  getEnergySeries: vi.fn(),
  getEnergySummary: vi.fn(),
}));

const house = (houseId: string): House => ({
  houseId,
  grid: { gridId: 'grid01', displayName: 'Grid 01' },
  meterId: `meter-${houseId}`,
  deviceClass: 'residential_prosumer',
  meterStatus: 'online',
});

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('resolveSelectedHouse', () => {
  const houses = [house('h1'), house('h2')];

  it('keeps the stored house when the user still owns it', () => {
    expect(resolveSelectedHouse(houses, 'h2')?.houseId).toBe('h2');
  });

  it('falls back to the first house otherwise', () => {
    expect(resolveSelectedHouse(houses, 'gone')?.houseId).toBe('h1');
    expect(resolveSelectedHouse(houses, null)?.houseId).toBe('h1');
  });

  it('has no house when the user has none', () => {
    expect(resolveSelectedHouse([], 'h1')).toBeNull();
  });
});

describe('IoT hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    act(() => useSelectedHouseStore.setState({ houseId: null }));
  });

  it('selects a house from the user’s houses and the stored choice', async () => {
    vi.mocked(listHouses).mockResolvedValue({
      houses: [house('h1'), house('h2')],
    });
    act(() => useSelectedHouseStore.getState().setHouseId('h2'));

    const { result } = renderHook(() => useSelectedHouse(), { wrapper });

    await waitFor(() => expect(result.current.house?.houseId).toBe('h2'));
    expect(result.current.houses).toHaveLength(2);
  });

  it('treats a missing latest reading as no reading yet', async () => {
    vi.mocked(getLatestReading).mockRejectedValue(
      new ApiError(404, 'NOT_FOUND', 'no reading', undefined, [], undefined),
    );

    const { result } = renderHook(() => useLatestReading('h1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('still reports other latest-reading failures', async () => {
    vi.mocked(getLatestReading).mockRejectedValue(
      new ApiError(500, 'INTERNAL_ERROR', 'boom', undefined, [], undefined),
    );

    const { result } = renderHook(() => useLatestReading('h1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('waits for a house before asking for energy data', () => {
    renderHook(() => useEnergySummary(undefined, { from: 'a', to: 'b' }), {
      wrapper,
    });

    expect(getEnergySummary).not.toHaveBeenCalled();
  });
});
