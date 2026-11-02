import { apiError, expect, test } from './fixtures';
import { HOUSE_ID, mockIot } from './iot-fixtures';

test.describe('IoT views', () => {
  test.beforeEach(({ api }) => {
    api.signIn();
  });

  test('dashboard shows the owned house and its meter', async ({
    page,
    api,
  }) => {
    mockIot(api);
    await page.goto('/dashboard');

    await expect(page.getByText('Meter online')).toBeVisible();
    await expect(page.getByText(HOUSE_ID).first()).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Generation and consumption over time' }),
    ).toBeVisible();
  });

  test('energy page loads the summary and charts for the period', async ({
    page,
    api,
  }) => {
    mockIot(api);
    await page.goto('/energy-assets');

    await expect(page.getByText('Self-consumption')).toBeVisible();
    await expect(
      page.getByRole('img', {
        name: 'Energy generated, consumed, exported and imported over time',
      }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Week', exact: true }).click();
    await expect
      .poll(() =>
        api.requests.some(
          ({ path }) =>
            path.endsWith('/energy-summary') && path.includes(HOUSE_ID),
        ),
      )
      .toBe(true);
  });

  test('custom range rejects more than 31 days', async ({ page, api }) => {
    mockIot(api);
    await page.goto('/energy-assets');

    await page.getByRole('button', { name: 'Custom', exact: true }).click();
    await page.getByLabel('From', { exact: true }).fill('2026-08-01');
    await page.getByLabel('To', { exact: true }).fill('2026-10-01');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(
      page.getByText('Choose a range of 31 days or fewer'),
    ).toBeVisible();
  });

  test('users without a linked meter see an empty state', async ({
    page,
    api,
  }) => {
    mockIot(api, []);
    await page.goto('/energy-assets');

    await expect(
      page.getByText('No smart meter linked yet').first(),
    ).toBeVisible();
  });

  test('a failed request offers a retry', async ({ page, api }) => {
    api.on(
      'GET',
      '/api/v1/iot/houses',
      apiError(503, 'UNAVAILABLE', 'IoT service unavailable.'),
    );
    await page.goto('/energy-assets');

    await expect(
      page.getByText("Couldn't load this data").first(),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Retry' }).first(),
    ).toBeVisible();
  });
});
