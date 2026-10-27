import { apiError, expect, test, testUser } from './fixtures';

test.describe('sign in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await expect(
      page.getByRole('heading', { name: 'Welcome back' }),
    ).toBeVisible();
  });

  test('shows validation errors for an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('signs in and opens the dashboard', async ({ page, api }) => {
    api.on('POST', '/api/v1/auth/login', () => {
      api.signIn();
      return { body: { userId: testUser.userId, email: testUser.email } };
    });

    await page.getByLabel('Email address').fill(testUser.email);
    await page.getByLabel('Password', { exact: true }).fill('Str0ngPassw0rd!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(
      page.getByRole('heading', { level: 1, name: /Good evening/ }),
    ).toBeVisible();
  });

  test('shows an error for wrong credentials', async ({ page, api }) => {
    api.on(
      'POST',
      '/api/v1/auth/login',
      apiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.'),
    );

    await page.getByLabel('Email address').fill(testUser.email);
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword1');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL('/sign-in');
  });

  test('links to forgot password and sign up', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL('/forgot-password');

    await page.goto('/sign-in');
    await page.getByRole('link', { name: 'Create Account' }).click();
    await expect(page).toHaveURL('/sign-up');
  });
});
