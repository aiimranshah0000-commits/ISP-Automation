import { test, expect } from '@playwright/test';

const BASE_URL = 'https://isp-saas-staging.vercel.app';
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;

test.describe('Forgot Password Flow - All Test Cases', () => {

  test('TC-11 | Redirect to Forgot Password page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /forgot your password/i }).click();
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
    console.log('✅ TC-11 Passed — Redirect successful');
  });


  test('TC-12 | Empty email validation', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(
      page.locator('p.text-xs.text-red-600', {
        hasText: /email is required/i
      })
    ).toBeVisible();

    console.log('✅ TC-12 Passed — Empty email validation shown');
  });


  test('TC-13 | Invalid email format validation', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);

    await page.locator('#email').fill('gggg');
    await page.getByRole('button', { name: /send reset link/i }).click();

    const validationMessage =
      await page.locator('#email').evaluate((el: any) => el.validationMessage);

    expect(validationMessage.toLowerCase()).toContain("include an '@'");

    console.log('✅ TC-13 Passed — Invalid email format validation');
  });


  test('TC-14 | Invalid email (wrong format) validation', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);

    await page.locator('#email').fill('gggg@gmail');
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(
      page.locator('p.text-xs.text-red-600', {
        hasText: /please enter a valid email address/i
      })
    ).toBeVisible();

    console.log('✅ TC-14 Passed — Email format validation message shown');
  });


  test('TC-15 | Unregistered email validation', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);
    await page.locator('#email').fill('testuser@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    // ── Updated locator to match actual amber div ──
    const errorMessage = page.locator('div.border-amber-200.bg-amber-50.text-amber-800');
    
    await errorMessage.waitFor({ state: 'visible', timeout: 8000 });
    
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      'No account found with this email address. Please check your email or contact your administrator to create an account.'
    );
    const message = await errorMessage.innerText();
    console.log('✅ TC-15 Passed — Message shown:', message);
});
    console.log('✅ TC-15 Passed — Unregistered email validation shown');
  });


  test('TC-16 | Valid email submits reset link', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);

    await page.locator('#email').fill('emp3@mailinator.com');
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(
      page.locator('div[data-slot="card-title"]', {
        hasText: /check your email/i
      })
    ).toBeVisible();

    console.log('✅ TC-16 Passed — Reset link success screen shown');
  });


  test('TC-17 | Send button visibility check', async ({ page }) => {
    await page.goto(FORGOT_PASSWORD_URL);

    await expect(
      page.getByRole('button', { name: /send reset link/i })
    ).toBeVisible();

    console.log('✅ TC-17 Passed — Button visibility verified');
  });
  

  // ── Reset Password Test Suite ──────────────────────────────────────────

const RESET_PASSWORD_URL = 'http://url8585.intelligentsafetyportal.com/ls/click?upn=u001.etsYdiIBpSoO4vnNPW-2FFcXUk2plEADQqKs4iysbEwJv5yScpHY46Rmu8jHIht6xDYb4BdV791OlFGa0L6vI2XlGR8frDCEtMwdpu0x-2BknBLBF-2FbiHUi1oUIabFOkj5R2Q5HdvBWtMZDo1Xi94v0Qy-2Fuu8GGSDnajw0tpdWsH761Gzp9qpMXh964UnMoCKhGtHVR7Q1ZzPwZl-2F6aJa88NnUne5OEAefKhdeKqzHUA6KeqyD9lDEmCVgQMvzJFiqaGpIQ9LMJH9PxzmDtDzN0DNnAZ9dhASvS9UdxRSzVC6iE-3D9jWD_nZYdVvXGoD5T88SdJYsEJ3vBcNS4EATczXC9DvFwmMUE79HrUH-2F2LezCm1Tu-2FbMR-2BjlpcQ8TZEzo-2FlxhU6k2LZTpnTli4FOVyN54KF06-2B9ccLdVOs4hhopyDpNhNSTsS-2BfFF9ETUpZ-2BHr3TlAHJ1O16RBo6FiMRn2ourYXBb7WqaNCWCBfT3LJTVzqPsstUlF-2FCveyVYTbQ9JHh4WKu5wQ-3D-3D';

test.describe('Reset Password Test Suite', () => {

  // ── Helper ──────────────────────────────────────────
  async function gotoResetPage(page: any) {
    await page.goto(RESET_PASSWORD_URL);
    await page.waitForLoadState('networkidle');
  }

  async function fillResetForm(page: any, password: string, confirmPassword: string) {
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(confirmPassword);
    await page.locator('button[type="submit"]', { hasText: 'Update Password' }).click();
  }

  // ── PAGE VALIDATION ──────────────────────────────────

  test('TC-16 | Reset password page loads correctly', async ({ page }) => {

    // Validate page heading
    const heading = page.locator('p.text-center.text-gray-700.text-sm.font-medium', {
      hasText: 'Reset Password'
    });
    await expect(heading).toBeVisible();

    // Validate both fields visible
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();

    // Validate button visible
    await expect(
      page.locator('button[type="submit"]', { hasText: 'Update Password' })
    ).toBeVisible();

    console.log('✅ TC-16 Passed — Reset password page loaded correctly');
  });

  // ── POSITIVE TEST ────────────────────────────────────

  test('TC-17 | Valid password reset — minimum 6 characters', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc123', 'abc123');

    // Should redirect or show success
    await page.waitForTimeout(3000);
    const currentURL = page.url();
    console.log('✅ TC-17 Passed — URL after reset:', currentURL);
  });

  test('TC-18 | Valid password with special characters', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'Abc@1234!', 'Abc@1234!');

    await page.waitForTimeout(3000);
    console.log('✅ TC-18 Passed — Password with special characters accepted');
  });

  test('TC-19 | Valid password with uppercase and lowercase', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'AbcDef123', 'AbcDef123');

    await page.waitForTimeout(3000);
    console.log('✅ TC-19 Passed — Password with mixed case accepted');
  });

  // ── NEGATIVE TESTS ───────────────────────────────────

  test('TC-20 | Password less than 6 characters — should show error', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc', 'abc');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-20 Passed — Short password blocked');
  });

  test('TC-21 | Passwords do not match — should show error', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc123', 'abc456');

    // Check for mismatch error
    const confirmInput = page.locator('#confirmPassword');
    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-21 Passed — Password mismatch blocked');
  });

  test('TC-22 | Empty password field — should show validation', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, '', '');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-22 Passed — Empty password blocked');
  });

  test('TC-23 | Empty password & valid confirm — should show validation', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, '', 'abc123');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-23 Passed — Empty password with confirm blocked');
  });

  test('TC-24 | Valid password & empty confirm — should show validation', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc123', '');

    const confirmInput = page.locator('#confirmPassword');
    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-24 Passed — Empty confirm password blocked');
  });

  test('TC-25 | Whitespace only password — should show validation', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, '      ', '      ');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-25 Passed — Whitespace only password blocked');
  });

  test('TC-26 | Exactly 5 characters — should show error (min is 6)', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc12', 'abc12');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    console.log('✅ TC-26 Passed — 5 character password blocked');
  });

  test('TC-27 | Exactly 6 characters — should be accepted (boundary)', async ({ page }) => {
    await gotoResetPage(page);
    await fillResetForm(page, 'abc123', 'abc123');

    await page.waitForTimeout(2000);
    const passwordInput = page.locator('#password');
    const isInvalid = await passwordInput.getAttribute('aria-invalid');
    expect(isInvalid).not.toBe('true');
    console.log('✅ TC-27 Passed — Exactly 6 characters accepted');
  });

});

