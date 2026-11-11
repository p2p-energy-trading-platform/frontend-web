import { apiError, expect, test } from './fixtures';

test.describe('sign up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
  });

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

  test('shows an error when the passwords do not match', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByLabel('Confirm Password').fill('DifferentPass1!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

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


  test('completes the full sign-up flow', async ({ page, api }) => {
    
    // 1. Complete account creation
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
      page.getByRole('heading', {
        level: 1,
        name: 'Verify your email',
      }),
    ).toBeVisible();

    
    // 2.Complete email verification
    api.on('POST', '/api/v1/auth/verify-email', {

      status: 200,
      body: {
        success: true,
        message: 'Email verified successfully',
      },

    });

    await page
          .getByRole('textbox', { name: '6-digit verification code' })
          .fill('123456');

    await page.getByRole('button', { name: 'Verify Email' }).click();      

    await expect(
      page.getByRole('button', { name: /KYC/i }),
    ).toBeVisible();


    // 3.Complete KYC submission
    api.on('POST', '/api/v1/kyc/upload-url', {

      status: 200,
      body: {
        uploadUrl: 'https://storage.example.com/test-upload',
        objectKey: 'kyc/test-user/identity.png',
        expiresIn: 300,
      },

    });

    api.on('POST', '/api/v1/kyc', {

      status: 201,
      body: {
        id: '00000000-0000-4000-8000-000000000003',
        state: 'PENDING',
        createdAt: '2026-11-10T10:00:00.000Z',
        updatedAt: '2026-11-10T10:00:00.000Z',
      },

    });

    await page.route(
      'https://storage.example.com/test-upload',
      async (route) => {
        await route.fulfill({
          status: 200,
        });
      },
    );


    await page.getByLabel('Legal Full Name').fill('New User');

    await page
          .getByLabel('Sri Lankan NIC Number')
          .fill('200012345678');

    
    await page.getByLabel('Date of birth').fill('2000-05-15');
    
    await page.locator('input[type="file"]').setInputFiles({
      
      name: 'identity.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake image content'),

    });

    await page.getByRole('button', { name: 'Submit KYC' }).click();

    await expect.poll(() =>
      api.requests.some(
        (request) => request.path === '/api/v1/kyc',
      ),
    ).toBe(true);

    const kycRequest = api.requests.find(
      (request) => request.path === '/api/v1/kyc',
    );

    expect(kycRequest?.body).toMatchObject({

      fullName: 'New User',
      nicNumber: '200012345678',
      dateOfBirth: '2000-05-15',
      documentPath: 'kyc/test-user/identity.png',

    });



    // 4.Complete smart meter registration
    api.on('POST', '/api/v1/registration/claim', {

      status: 200,
      body: {
        registration_id: '00000000-0000-4000-8000-000000000004',
        status: 'PENDING',
        message: 'Meter connection request submitted successfully',
      },

    });

    await expect(
      page.getByRole('heading', { name: 'Smart Meter' }),
    ).toBeVisible();

    await page.getByLabel('Smart Meter ID').fill('MTR-7829-XY');

    await page
      .getByRole('button', { name: 'Send Connection Request' })
      .click();

    await expect.poll(() =>
      api.requests.some(
        (request) => request.path === '/api/v1/registration/claim',
      ),
    ).toBe(true);

    const meterClaimRequest = api.requests.find(
      (request) => request.path === '/api/v1/registration/claim',
    );

    expect(meterClaimRequest?.body).toMatchObject({
      meter_id: 'MTR-7829-XY',
    });



    // 5.Verify registration completion
    await expect(
      page.getByText('Onboarding complete'),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Registration saved' }),
    ).toBeVisible();

    const registrationSummary = page
      .getByRole('heading', { name: 'Registration saved' })
      .locator('..');

    await expect(registrationSummary).toContainText('Identity status');
    await expect(registrationSummary).toContainText('Smart meter');

    await expect(registrationSummary).toContainText('Pending');

    await expect(
      page.getByRole('link', { name: 'View Profile' }),
    ).toBeVisible();

  });

});
