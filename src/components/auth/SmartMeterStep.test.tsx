// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SmartMeterStep } from './SmartMeterStep';

const { mutateAsync, reset } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('#/features/registration/hooks', async () => {
  const { useState } = await import('react');

  return {
    useInitiateMeterClaim: () => {
      const [error, setError] = useState<Error | null>(null);

      return {
        mutateAsync: async (...args: Parameters<typeof mutateAsync>) => {
          try {
            return await mutateAsync(...args);
          } catch (caughtError) {
            setError(
              caughtError instanceof Error
                ? caughtError
                : new Error(String(caughtError)),
            );
            throw caughtError;
          }
        },
        reset: () => {
          reset();
          setError(null);
        },
        error,
        isPending: false,
      };
    },
  };
});

describe('SmartMeterStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the meter claim before completing the step', async () => {
    const onComplete = vi.fn();
    mutateAsync.mockResolvedValue({
      registration_id: 'registration-123',
      status: 'pending',
      message: 'Approval request sent',
    });

    render(<SmartMeterStep onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText('Smart Meter ID'), {
      target: { value: ' MTR-7829-XY ' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /send connection request/i }),
    );

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ meter_id: 'MTR-7829-XY' });
      expect(onComplete).toHaveBeenCalledWith('pending');
    });
  });

  it('shows a claim error and keeps the user on the step', async () => {
    const onComplete = vi.fn();
    mutateAsync.mockRejectedValue(new Error('Meter not found'));

    render(<SmartMeterStep onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText('Smart Meter ID'), {
      target: { value: 'MTR-7829-XY' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /send connection request/i }),
    );

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Meter not found',
    );
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not send an empty meter ID', async () => {
    const onComplete = vi.fn();

    render(<SmartMeterStep onComplete={onComplete} />);
    fireEvent.click(
      screen.getByRole('button', { name: /send connection request/i }),
    );

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Please enter a valid Smart Meter ID',
    );
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
