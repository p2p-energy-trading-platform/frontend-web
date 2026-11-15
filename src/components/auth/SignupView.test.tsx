import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignupView from './SignupView';

const { useSearch, navigate } = vi.hoisted(() => ({
  useSearch: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({ useSearch }),
  useNavigate: () => navigate,
}));

vi.mock('#/features/auth/hooks', () => ({
  useAuthUser: () => ({ data: undefined, isLoading: false }),
}));

vi.mock('#/hooks/useAuth', () => ({
  useRegistration: () => ({
    source: 'demo',
    advanceStep: vi.fn(),
    completeSmartMeter: vi.fn(),
  }),
}));

vi.mock('#/components/auth/CreateAccountForm', () => ({
  CreateAccountForm: () => <div>Account form</div>,
}));

vi.mock('#/components/auth/VerifyEmailStep', () => ({
  VerifyEmailStep: () => <div>Email verification form</div>,
}));

vi.mock('#/components/auth/KycStep', () => ({
  KycStep: () => <div>KYC form</div>,
}));

vi.mock('#/components/auth/SmartMeterStep', () => ({
  SmartMeterStep: () => <div>Smart meter form</div>,
}));

vi.mock('#/components/auth/RegistrationStepper', () => ({
  RegistrationStepper: () => <div>Registration stepper</div>,
}));

vi.mock('./SignupSidebar', () => ({
  default: () => <div>Signup sidebar</div>,
}));

vi.mock('./RegistrationComplete', () => ({
  default: () => <div>Registration complete</div>,
}));

describe('SignupView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('defaults to the account step when no URL step is provided', () => {
    useSearch.mockReturnValue({});

    render(<SignupView />);

    expect(screen.getByText('Account form')).toBeTruthy();
    expect(screen.queryByText('KYC form')).toBeNull();
  });

  it.each([
    ['account', 'Account form'],
    ['verify-email', 'Email verification form'],
    ['kyc', 'KYC form'],
    ['smart-meter', 'Smart meter form'],
    ['complete', 'Registration complete'],
  ])('renders the %s step from the URL', (step, expectedContent) => {
    useSearch.mockReturnValue({ step });

    render(<SignupView />);

    expect(screen.getByText(expectedContent)).toBeTruthy();
  });
});
