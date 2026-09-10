import { test, expect } from '@playwright/test';

const BASE_URL = 'https://isp-saas-staging.vercel.app';
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;
test.describe('Forgot Password Flow - All Test Cases', () => {
  test('TC-11 to TC-17 | Forgot Password Flow', async ({ page }) => {
    // TC-11 | Redirect to Forgot Password page
    await page.goto(BASE_URL);
    await page.getByRole('link', {
      name: /forgot your password/i
    }).click();
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
    console.log('✅ TC-11 Passed — Redirect successful');
    await page.waitForTimeout(2000);
    // TC-12 | Empty email validation
    await page.getByRole('button', {
      name: /send reset link/i
    }).click();
    await expect(
      page.locator('p.text-xs.text-red-600', {
        hasText: /email is required/i
      })
    ).toBeVisible();
    console.log('✅ TC-12 Passed — Empty email validation shown');
    await page.waitForTimeout(2000);
    // TC-13 | Invalid email format validation
    await page.locator('#email').fill('gggg');
    await page.getByRole('button', {
      name: /send reset link/i
    }).click();
    const validationMessage = await page
      .locator('#email')
      .evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.toLowerCase()).toContain("include an '@'");
    console.log('✅ TC-13 Passed — Invalid email format validation');
    await page.waitForTimeout(2000);
    // TC-14 | Invalid email validation
    await page.locator('#email').fill('gggg@gmail');
    await page.getByRole('button', {
      name: /send reset link/i
    }).click();
    await expect(
      page.locator('p.text-xs.text-red-600', {
        hasText: /please enter a valid email address/i
      })
    ).toBeVisible();
    console.log('✅ TC-14 Passed — Email format validation message shown');
    await page.waitForTimeout(2000);
    // TC-15 | Unregistered email validation
    await page.locator('#email').fill('testuser@example.com');
    await page.getByRole('button', {
      name: /send reset link/i
    }).click();
    const errorMessage = page.locator(
      'div.border-amber-200.bg-amber-50.text-amber-800'
    );
    await errorMessage.waitFor({
      state: 'visible',
      timeout: 8000
    });
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      'No account found with this email address. Please check your email or contact your administrator to create an account.'
    );
    const message = await errorMessage.innerText();
    console.log('✅ TC-15 Passed — Message shown:', message);
    await page.waitForTimeout(2000);
    // TC-16 | Valid email submits reset link
    await page.goto(FORGOT_PASSWORD_URL);
    await page.locator('#email').fill(
      'ai.imranshah0000+1@gmail.com'
    );
    await page.getByRole('button', {
      name: /send reset link/i
    }).click();
    await expect(
      page.locator('div[data-slot="card-title"]', {
        hasText: /check your email/i
      })
    ).toBeVisible();
    console.log(
      '✅ TC-16 Passed — Reset link success screen shown'
    );
    await page.waitForTimeout(2000);
    // TC-17 | Send button visibility check
    await page.goto(FORGOT_PASSWORD_URL);
    await expect(
      page.getByRole('button', {
        name: /send reset link/i
      })
    ).toBeVisible();

    console.log(
      '✅ TC-17 Passed — Button visibility verified'
    );
    await page.waitForTimeout(2000);
  });
});
  // ── Reset Password Test Suite ──────────────────────────────────────────
const RESET_PASSWORD_URL = 'http://url8585.intelligentsafetyportal.com/ls/click?upn=u001.etsYdiIBpSoO4vnNPW-2FFcXUk2plEADQqKs4iysbEwJv5yScpHY46Rmu8jHIht6xDYb4BdV791OlFGa0L6vI2XsbjH19xqKuNlIAG8BJtiMYVs5VeIJB87dJhyJIvSVVo3qKBqS9vhX7Th6W-2F1auDxqQmEn1C87X47L9QsMejDtXfnt9eL18y-2FHZbv1M2fuDc8K1wGBuxktK3IR2bysiUnhAtQDlzLIN5-2FR7J-2FbydCKVbu9ngErIXZNGc9QwNBrCM1nzRZGoc7omtfmnuIghmJzOJhgu8XfGosJWTyRsld0o-3DdskO_wbxLdHY53McFyoDgeNivR4nDsFxG9eqDZN1kXOE1ZBw-2B7lWcNw-2BlrcEZ0o9Irc8Oq5bGLYO-2FHCOPP2J4-2Fzf6-2BtrnB29BE5-2BEAB-2B6K2jf-2FYDU0u-2Fdu-2FWLCZLpL3pTHqHfiy9S1LP55v1pYEkI1bRbdkMIVW6DOfM8NKKHZtKVjQSr9PP9HN9VGSiI3p9bke4CzmBJyXMtAD-2FN5qrFjZzFAg-3D-3D';
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
});

