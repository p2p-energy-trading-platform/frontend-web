
import { apiError, expect, test } from './fixtures';

test.describe('sign up', () => {
  // 1. Open the sign-up page before every test.
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');

    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
  });

  // 2. Test validation errors for an empty form.
  test('shows validation errors for an empty form', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Enter a valid email address')).toBeVisible();

    await expect(
      page.getByText('Password must be 8 to 128 characters'),
    ).toBeVisible();

    await expect(
      page.getByText('You must accept the terms to continue'),
    ).toBeVisible();

    expect(
      api.requests.some((request) => request.path === '/api/v1/auth/register'),
    ).toBe(false);
  });

  // 3. Test password mismatch validation.
  test('shows an error when the passwords do not match', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByLabel('Confirm Password').fill('DifferentPass1!');

    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  // 4. Test successful account creation.
  test('creates an account and moves to email verification', async ({
    page,
    api,
  }) => {
    api.on('POST', '/api/v1/auth/register', {
      status: 201,
      body: {
        userId: '00000000-0000-4000-8000-000000000002',
        email: 'new.user@example.com',
        status: 'PENDING',
        createdAt: '2026-10-27T08:00:00.000Z',
      },
    });

    await page.getByLabel('Full Name').fill('New User');
    await page.getByLabel('Email Address').fill('new.user@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByLabel('Confirm Password').fill('Str0ngPassw0rd!');
    await page.getByRole('checkbox').click();

    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: 'Verify your email' }),
    ).toBeVisible();

    await expect(page.getByText('new.user@example.com')).toBeVisible();

    const registerRequest = api.requests.find(
      (request) => request.path === '/api/v1/auth/register',
    );

    expect(registerRequest?.body).toEqual({
      name: 'New User',
      email: 'new.user@example.com',
      password: 'Str0ngPassw0rd!',
    });
  });

  // 5. Test API error for an already registered email.
  test('shows the API error when the email is already registered', async ({
    page,
    api,
  }) => {
    api.on(
      'POST',
      '/api/v1/auth/register',
      apiError(409, 'CONFLICT', 'An account with this email already exists.'),
    );

    await page.getByLabel('Full Name').fill('Existing User');
    await page.getByLabel('Email Address').fill('aisha@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByLabel('Confirm Password').fill('Str0ngPassw0rd!');
    await page.getByRole('checkbox').click();

    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(
      page.getByText('An account with this email already exists.'),
    ).toBeVisible();
  });

  // 6. Test the complete sign-up flow.
  test('completes the full sign-up flow', async ({ page, api }) => {
    // 6.1 Mock account registration.
    api.on('POST', '/api/v1/auth/register', {
      status: 201,
      body: {
        userId: '00000000-0000-4000-8000-000000000002',
        email: 'new.user@example.com',
        status: 'PENDING',
        createdAt: '2026-10-27T08:00:00.000Z',
      },
    });

    // 6.2 Mock email verification.
    api.on('POST', '/api/v1/auth/verify-email', {
      status: 200,
      body: {
        success: true,
      },
    });

    // 6.3 Complete account creation.
    await page.getByLabel('Full Name').fill('New User');
    await page.getByLabel('Email Address').fill('new.user@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByLabel('Confirm Password').fill('Str0ngPassw0rd!');
    await page.getByRole('checkbox').click();

    await page.getByRole('button', { name: 'Create Account' }).click();

    // 6.4 Verify that the email verification step appears.
    await expect(
      page.getByRole('heading', { level: 1, name: 'Verify your email' }),
    ).toBeVisible();

    await expect(
      page.getByText('Account created. We sent a verification code to your email.'),
    ).toBeVisible();

    // 6.5 Enter the six-digit verification code.
    await page.getByLabel('6-digit verification code').fill('123456');

    // 6.6 Submit email verification.
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // 6.7 Verify that the KYC step appears.
    // Add the actual KYC heading assertion after inspecting KycStep.tsx.

    // 6.8 Complete KYC form and document upload.
    // Add the actual KYC form fields and upload interaction.

    // 6.9 Submit KYC.
    // Add the KYC submission assertion.

    // 6.10 Verify that the smart meter step appears.
    // Add the actual smart meter heading assertion.

    // 6.11 Complete smart meter registration.
    // Add the actual meter form fields and submission.

    // 6.12 Verify registration completion.
    // Add the actual completion heading assertion.
  });
});
