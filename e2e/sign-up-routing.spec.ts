import { expect, test, testUser } from './fixtures';

test.describe('sign-up URL routing', () => {
  test('redirects signed-out users from KYC to the account form', async ({
    page,
  }) => {
    await page.goto('/sign-up?step=kyc');

    await expect(page).toHaveURL('/sign-up');
    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
  });

  test('requires a pending verification email for signed-out verification', async ({
    page,
  }) => {
    await page.goto('/sign-up?step=verify-email');

    await expect(page).toHaveURL('/sign-up');
    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
  });

  test('allows signed-out verification when a pending email is stored', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gridx.pendingVerificationEmail',
        'new.user@example.com',
      );
    });

    await page.goto('/sign-up?step=verify-email');

    await expect(page).toHaveURL('/sign-up?step=verify-email');
    await expect(
      page.getByRole('heading', { name: 'Verify your email', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('new.user@example.com')).toBeVisible();
  });

  test('redirects pending users to email verification', async ({
    page,
    api,
  }) => {
    api.signIn({ ...testUser, status: 'PENDING' });

    await page.goto('/sign-up');

    await expect(page).toHaveURL('/sign-up?step=verify-email');
    await expect(
      page.getByRole('heading', { name: 'Verify your email', exact: true }),
    ).toBeVisible();
  });

  test('redirects active users away from the account form', async ({
    page,
    api,
  }) => {
    api.signIn();

    await page.goto('/sign-up');

    await expect(page).toHaveURL('/dashboard');
  });

  for (const kycStatus of ['pending', 'verified'] as const) {
    test(`redirects active users with ${kycStatus} KYC away from KYC`, async ({
      page,
      api,
    }) => {
      api.signIn({ ...testUser, kycStatus });

      await page.goto('/sign-up?step=kyc');

      await expect(page).toHaveURL('/dashboard');
    });
  }

  for (const kycStatus of ['none', 'rejected'] as const) {
    test(`allows active users with ${kycStatus} KYC to access KYC`, async ({
      page,
      api,
    }) => {
      api.signIn({ ...testUser, kycStatus });

      await page.goto('/sign-up?step=kyc');

      await expect(page).toHaveURL('/sign-up?step=kyc');
      await expect(
        page.getByRole('heading', { name: 'Identity Verification' }),
      ).toBeVisible();
    });
  }

  test('preserves the smart-meter step after a page refresh', async ({
    page,
    api,
  }) => {
    api.signIn();

    await page.goto('/sign-up?step=smart-meter');

    await expect(
      page.getByRole('heading', { name: 'Smart Meter' }),
    ).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL('/sign-up?step=smart-meter');
    await expect(
      page.getByRole('heading', { name: 'Smart Meter' }),
    ).toBeVisible();
  });

  test('allows active users to access the completion step directly', async ({
    page,
    api,
  }) => {
    api.signIn();

    await page.goto('/sign-up?step=complete');

    await expect(page).toHaveURL('/sign-up?step=complete');
    await expect(
      page.getByRole('heading', { name: 'Registration saved' }),
    ).toBeVisible();
  });

  test('allows skipping optional KYC without creating a submission', async ({
    page,
    api,
  }) => {
    api.signIn();

    await page.goto('/sign-up?step=kyc');

    await page.getByRole('button', { name: 'Skip for Now' }).click();

    await expect(page).toHaveURL('/sign-up?step=smart-meter');
    await expect(
      page.getByRole('heading', { name: 'Smart Meter' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Skip for Now' }).click();

    await expect(page).toHaveURL('/sign-up?step=complete');
    await expect(
      page.getByRole('heading', { name: 'Registration saved' }),
    ).toBeVisible();
    await expect(
      page.getByText('Not submitted', { exact: true }),
    ).toBeVisible();

    expect(api.requests.some((request) => request.path.includes('/kyc'))).toBe(
      false,
    );
  });
});
