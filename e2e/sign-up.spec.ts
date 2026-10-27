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
});
