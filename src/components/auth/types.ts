export type SIGN_UP_STATES =
  'account' | 'verify-email' | 'kyc' | 'smart-meter' | 'complete';
export type KycStatus = 'not-submitted' | 'pending' | 'verified' | 'rejected';
export type SmartMeterStatus = 'pending' | 'connected' | 'skipped';
