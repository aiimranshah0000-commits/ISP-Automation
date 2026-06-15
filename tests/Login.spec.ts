import { test, expect } from '@playwright/test';

test.describe('Login Test Suite', () => {

  // ── Helper ──────────────────────────────────────────
  async function fillLogin(page: any, email: string, password: string) {
    await page.goto('https://isp-saas-staging.vercel.app/');
    const emailInput = page.locator('#emailOrUsername');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(email);
    await page.locator('#password').fill(password);
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
  }

  async function getErrorMessage(page: any) {
    const error = page.locator('div.bg-red-50 p.text-red-600');
    await error.waitFor({ state: 'visible', timeout: 5000 });
    return await error.innerText();
  }

  // ── POSITIVE TEST ────────────────────────────────────

  test('TC-01 | Valid login — should redirect to dashboard', async ({ page }) => {
    await fillLogin(page, 'emp3@mailinator.com', 'password');
    await page.waitForURL('**/company/northdev/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(
      'https://isp-saas-staging.vercel.app/company/northdev/dashboard'
    );
    console.log('✅ TC-01 Passed — Redirected to dashboard successfully');
  });

  // ── NEGATIVE TESTS ───────────────────────────────────

  test('TC-02 | Wrong email & wrong password — should show error', async ({ page }) => {
    await fillLogin(page, 'wrong@example.com', 'wrongPassword');

    const message = await getErrorMessage(page);
    expect(message).toContain('Invalid email/username or password. Please check your credentials and try again.');
    console.log('✅ TC-02 Passed — Error message:', message);
  });

  test('TC-03 | Valid email & wrong password — should show error', async ({ page }) => {
    await fillLogin(page, 'emp3@mailinator.com', 'wrongPassword');

    const message = await getErrorMessage(page);
    expect(message).toContain('Invalid email/username or password. Please check your credentials and try again.');
    console.log('✅ TC-03 Passed — Error message:', message);
  });

  test('TC-04 | Wrong email & valid password — should show error', async ({ page }) => {
    await fillLogin(page, 'wrong@example.com', 'password');

    const message = await getErrorMessage(page);
    expect(message).toContain('Invalid email/username or password. Please check your credentials and try again.');
    console.log('✅ TC-04 Passed — Error message:', message);
  });

  // ── EMPTY FIELD TESTS ────────────────────────────────

 test('TC-05 | Empty email & empty password — should show validation', async ({ page }) => {
  await page.goto('https://isp-saas-staging.vercel.app/');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(
    page.getByText('Email or username is required')
  ).toBeVisible();
  await expect(
    page.getByText('Password must be at least 6 characters')
  ).toBeVisible();

  console.log('✅ TC-05 Passed — Validation messages displayed for email and password');
});
  test('TC-06 | Empty email & valid password — should show validation', async ({ page }) => {
    await page.goto('https://isp-saas-staging.vercel.app/');
    await page.locator('#password').fill('validPassword123');
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
    await expect(
    page.getByText('Email or username is required')
  ).toBeVisible();
    console.log('✅ TC-06 Passed — Empty email blocked submission');
  });

  test('TC-07 | Valid email & empty password — should show validation', async ({ page }) => {
    await page.goto('https://isp-saas-staging.vercel.app/');
    const emailInput = page.locator('#emailOrUsername');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('emp3@mailinator.com');
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();

    await expect(
    page.getByText('Password must be at least 6 characters')
  ).toBeVisible();
    console.log('✅ TC-07 Passed — Empty password blocked submission');
  });

  // ── FORMAT VALIDATION TESTS ──────────────────────────

  test('TC-08 | Invalid email format — should show validation', async ({ page }) => {
    await fillLogin(page, 'notanemail', 'validPassword123');

   await expect(
    page.getByText('Invalid username or password')
  ).toBeVisible();
    console.log('✅ TC-08 Passed — Invalid email format blocked');
  });

  test('TC-09 | SQL injection in email — should show error not crash', async ({ page }) => {
    await fillLogin(page, "' OR '1'='1", 'password');

    const message = await getErrorMessage(page);
    expect(message).toContain('Invalid username or password');
    console.log('✅ TC-09 Passed — SQL injection handled safely:', message);
  });

  test('TC-10 | Whitespace only in fields — should show validation', async ({ page }) => {
    await fillLogin(page, '   ', '   ');
   await expect(
    page.getByText('Email or username is required')
  ).toBeVisible();
  await expect(
    page.getByText('Password must be at least 6 characters')
  ).toBeVisible();
    console.log('✅ TC-10 Passed — Whitespace only blocked');
  });

});