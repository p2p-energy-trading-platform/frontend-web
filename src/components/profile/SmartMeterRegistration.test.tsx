// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SmartMeterRegistration from './SmartMeterRegistration';

const { mutateAsync, initiateMeterClaim } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  initiateMeterClaim: vi.fn(),
}));

vi.mock('#/features/auth/hooks', () => ({
  useAuthUser: () => ({ data: { userId: 'user-1' } }),
}));

vi.mock('#/features/iot/hooks', () => ({
  useSelectedHouse: () => ({
    house: null,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('#/features/registration/hooks', () => ({
  useInitiateMeterClaim: () => ({
    mutateAsync: initiateMeterClaim,
    reset: vi.fn(),
    error: null,
    isPending: false,
  }),
  useReverifyRegistration: () => ({
    mutateAsync,
    error: null,
    isPending: false,
  }),
}));

describe('SmartMeterRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lets users skipped during signup initiate a meter registration', async () => {
    render(<SmartMeterRegistration />);

    fireEvent.click(
      screen.getByRole('button', { name: /register a smart meter/i }),
    );

    expect(await screen.findByLabelText('Smart Meter ID')).not.toBeNull();
    expect(screen.queryByRole('button', { name: /skip for now/i })).toBeNull();
  });

  it('reverifies a saved registration using its existing identifiers', async () => {
    window.localStorage.setItem(
      'gridx.smartMeterRegistration.user-1',
      JSON.stringify({
        registrationId: 'registration-123',
        meterId: 'MTR-7829-XY',
        status: 'EXPIRED',
      }),
    );
    mutateAsync.mockResolvedValue({
      registration_id: 'registration-123',
      meter_id: 'MTR-7829-XY',
      message: 'Registration status reverification started',
      status: 'DEWA_APPROVAL_PENDING',
    });

    render(<SmartMeterRegistration />);

    fireEvent.click(
      await screen.findByRole('button', { name: /recheck dewa status/i }),
    );

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        registration_id: 'registration-123',
        meter_id: 'MTR-7829-XY',
      });
    });
    expect(await screen.findByText(/awaiting dewa approval/i)).not.toBeNull();
    expect(initiateMeterClaim).not.toHaveBeenCalled();
  });
});
