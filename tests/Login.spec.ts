import { test, expect } from '@playwright/test';

test.describe('Login Test Suite', () => {
  async function wait2000(page: any) {
    await page.waitForTimeout(2000);
  }

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
    await error.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    return await error.innerText();
  }
  test('Login Test Suite | Verify all login scenarios sequentially', async ({ page }) => {
    // ── TC-02 WRONG EMAIL & WRONG PASSWORD ───────────────
    await fillLogin(page, 'wrong@example.com', 'wrongPassword');
    let message = await getErrorMessage(page);
    expect(message).toContain(
      'Invalid email/username or password. Please check your credentials and try again.'
    );
    console.log('✅ TC-02 Passed — Error message:', message);
    await wait2000(page);
    // ── TC-03 VALID EMAIL & WRONG PASSWORD ───────────────
    await fillLogin(page, 'emp3@mailinator.com', 'wrongPassword');
    message = await getErrorMessage(page);
    expect(message).toContain(
      'Invalid email/username or password. Please check your credentials and try again.'
    );
    console.log('✅ TC-03 Passed — Error message:', message);
    await wait2000(page);
    // ── TC-04 WRONG EMAIL & VALID PASSWORD ───────────────
    await fillLogin(page, 'wrong@example.com', 'password');
    message = await getErrorMessage(page);
    expect(message).toContain(
      'Invalid email/username or password. Please check your credentials and try again.'
    );
    console.log('✅ TC-04 Passed — Error message:', message);
    await wait2000(page);
    // ── TC-05 EMPTY EMAIL & EMPTY PASSWORD ───────────────
    await page.goto('https://isp-saas-staging.vercel.app/');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(
      page.getByText('Email or username is required')
    ).toBeVisible();
    await expect(
      page.getByText('Password must be at least 6 characters')
    ).toBeVisible();
    console.log(
      '✅ TC-05 Passed — Validation messages displayed for email and password'
    );
    await wait2000(page);
    // ── TC-06 EMPTY EMAIL & VALID PASSWORD ───────────────
    await page.goto('https://isp-saas-staging.vercel.app/');
    await page.locator('#password').fill('validPassword123');
    await page
      .locator('button[type="submit"]', { hasText: 'Sign In' })
      .click();
    await expect(
      page.getByText('Email or username is required')
    ).toBeVisible();
    console.log('✅ TC-06 Passed — Empty email blocked submission');
    await wait2000(page);
    // ── TC-07 VALID EMAIL & EMPTY PASSWORD ───────────────
    await page.goto('https://isp-saas-staging.vercel.app/');
    await page.locator('#emailOrUsername').fill('emp3@mailinator.com');
    await page
      .locator('button[type="submit"]', { hasText: 'Sign In' })
      .click();
    await expect(
      page.getByText('Password must be at least 6 characters')
    ).toBeVisible();
    console.log('✅ TC-07 Passed — Empty password blocked submission');
    await wait2000(page);
    // ── TC-08 INVALID EMAIL FORMAT ───────────────────────
    await fillLogin(page, 'notanemail', 'validPassword123');
    await expect(
      page.getByText('Invalid username or password')
    ).toBeVisible();
    console.log('✅ TC-08 Passed — Invalid email format blocked');
    await wait2000(page);
    // ── TC-09 SQL INJECTION ──────────────────────────────
    await fillLogin(page, "' OR '1'='1", 'password');
    message = await getErrorMessage(page);
    expect(message).toContain('Invalid username or password');
    console.log('✅ TC-09 Passed — SQL injection handled safely:', message);
    await wait2000(page);
    // ── TC-10 WHITESPACE ONLY ────────────────────────────
    await fillLogin(page, '   ', '   ');
    await expect(
      page.getByText('Email or username is required')
    ).toBeVisible();
    await expect(
      page.getByText('Password must be at least 6 characters')
    ).toBeVisible();
    console.log('✅ TC-10 Passed — Whitespace only blocked');
    await wait2000(page);
    // ── TC-01 POSITIVE TEST — RUN LAST ───────────────────
    await fillLogin(page, 'northdev@mailinator.com', 'password');
    await page.waitForURL('**/company/northdev/dashboard', {
      timeout: 10000,
    });
    await expect(page).toHaveURL(
      'https://isp-saas-staging.vercel.app/company/northdev/dashboard'
    );
    console.log('✅ TC-01 Passed — Redirected to dashboard successfully');
    await wait2000(page);
    // ── FINAL RESULT ─────────────────────────────────────
    console.log('🎉 All 10 login test scenarios passed successfully.');
  });
});
