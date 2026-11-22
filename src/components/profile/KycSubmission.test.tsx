// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import KycSubmission from './KycSubmission';

const { useKycSubmission } = vi.hoisted(() => ({
  useKycSubmission: vi.fn(),
}));

vi.mock('#/features/kyc/hooks', () => ({ useKycSubmission }));
vi.mock('#/components/auth/KycStep', () => ({
  KycStep: ({ allowSkip }: { allowSkip: boolean }) => (
    <div data-testid="kyc-step" data-allow-skip={allowSkip} />
  ),
}));

describe('KycSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a saved submission as read-only', () => {
    useKycSubmission.mockReturnValue({
      data: {
        id: 'kyc-1',
        fullName: 'Jane Doe',
        dateOfBirth: '1998-04-12',
        nicNumber: '987654321V',
        state: 'PENDING',
        createdAt: '2026-10-22T00:00:00.000Z',
        updatedAt: '2026-10-22T00:00:00.000Z',
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<KycSubmission />);

    expect(screen.getByText('Jane Doe')).not.toBeNull();
    expect(screen.getByText('987654321V')).not.toBeNull();
    expect(screen.getByText('Uploaded securely')).not.toBeNull();
    expect(screen.getByText(/read-only/i)).not.toBeNull();
    expect(screen.queryByRole('button', { name: /submit kyc/i })).toBeNull();
  });

  it('allows skipped users to open the form without a skip action', () => {
    useKycSubmission.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<KycSubmission />);
    fireEvent.click(screen.getByRole('button', { name: /submit kyc/i }));

    expect(screen.getByTestId('kyc-step').getAttribute('data-allow-skip')).toBe(
      'false',
    );
  });
});
