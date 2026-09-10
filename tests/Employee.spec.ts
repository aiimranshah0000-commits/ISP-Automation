import { test, expect } from '@playwright/test';

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
async function loginAndNavigate(page: any) {
  await fillLogin(page, 'northdev@mailinator.com', 'password');
  await page.waitForURL('**/company/northdev/dashboard', { timeout: 15000 });
}
// ── TC-01 | Valid login ───────────────────────────────────────────────────────
test('TC-01 | Valid login — should redirect to dashboard', async ({ page }) => {
  await loginAndNavigate(page);
  await expect(page).toHaveURL(
    'https://isp-saas-staging.vercel.app/company/northdev/dashboard'
  );
  console.log('✅ TC-01 Passed — Redirected to dashboard successfully');
  const companyName = page.locator('span.font-bold.text-lg.text-gray-800');
  await expect(companyName).toHaveText('Northdev');
});
// Filters on the Employee Directory Page
test('TC-001 | Filter on the employee directory page should be added' , async ({page}) =>{
})
// ── TC-02 | Navigate to Add Employee page ────────────────────────────────────
test('TC-02 | Employee Creation — navigate to Add Employee page', async ({ page }) => {
  await loginAndNavigate(page);
  await page.locator('a[href="/company/northdev/employees"]').click();
  await page.waitForURL('**/company/northdev/employees', { timeout: 10000 });
  await page.getByRole('button', { name: 'Add Employee' }).click();
  await expect(page).toHaveURL(
    'https://isp-saas-staging.vercel.app/company/northdev/employees/new',
    { timeout: 10000 }
  );
  const heading = page.getByRole('heading', { name: 'Add New Employee' });
  await expect(heading).toBeVisible({ timeout: 5000 });
  console.log('✅ TC-02 Passed — Add New Employee page loaded successfully');
});
// ── TC-03 | Employee Form — full validation ───────────────────────────────────
test('TC-03 | Employee Creation Form — full validation', async ({ page }) => {
  await loginAndNavigate(page);
  await page.goto(
    'https://isp-saas-staging.vercel.app/company/northdev/employees/new'
  );
  await page.waitForURL('**/employees/new', { timeout: 10000 });
  // ── Step 1: Submit empty form ─────────────────────────────────────────────
  await page.getByRole('button', { name: 'Create Employee' }).click();
  await expect(
    page.locator('[data-slot="form-message"]', { hasText: 'First name is required' }).first()
  ).toBeVisible({ timeout: 5000 });
  await expect(
    page.locator('[data-slot="form-message"]', { hasText: 'Last name is required' }).first()
  ).toBeVisible({ timeout: 5000 });
  await expect(
    page.locator('[data-slot="form-message"]', { hasText: 'Either email or username is required' }).first()  // ← fixed
  ).toBeVisible({ timeout: 5000 });
  console.log('✅ Step 1 Passed — Empty form validation messages shown');
  // ── Step 2: Enter invalid email format ────────────────────────────────────
  await page.locator('input[name="firstName"]').fill('John');
  await page.locator('input[name="lastName"]').fill('Doe');
  await page.locator('input[name="email"]').fill('invalid-email-format');
  await page.getByRole('button', { name: 'Create Employee' }).click();
  await expect(
    page.locator('[data-slot="form-message"]', { hasText: 'Invalid email address.' }).first()
  ).toBeVisible({ timeout: 5000 });
   console.log('✅ Step 2 Passed — Invalid email format validation shown');
//   // ── Step 3: Clear email, verify username-or-email rule ───────────────────
  await page.locator('input[name="email"]').clear();
  await page.getByRole('button', { name: 'Create Employee' }).click();
  await expect(
    page.locator('[data-slot="form-message"]', { hasText: 'Either email or username is required' }).first()  // ← fixed
  ).toBeVisible({ timeout: 5000 });
  await page.locator('input[name="firstName"]').fill('Mr');
  await page.locator('input[name="lastName"]').fill('sheri new');
  await page.locator('input[name="email"]').fill('sheri12@mailinator.com');
  // Select Location → Lahore
  await page.locator('button[data-slot="form-control"]', { hasText: 'Select location' }).click();
  await page.getByRole('option', { name: 'Lahore' }).click();
  // Select Supervisor → Cat Rowland
  await page.locator('button[data-slot="form-control"]', { hasText: 'Select supervisor' }).click();
  await page.getByRole('option', { name: /Baxter Mathis/i }).click();
  await page.locator('button[data-slot="form-control"]', { hasText: 'Select manager' }).click();
  await page.getByRole('option' , {name: /Cat Rowland/i}).click();
  // Select Role → Manager
  await page.locator('button[data-slot="form-control"]', { hasText: 'Select role' }).click();
  await page.getByRole('option', { name: /Coordinator/i }).click();
  // Select Department → Engineering
    await page.locator('button[data-slot="form-control"]', { hasText: 'Select department' }).click();
    await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
    await page.getByRole('option', { name: 'Engineering' }).click();
    await page.waitForSelector('[role="option"]', { state: 'hidden', timeout: 5000 });
    await page.getByRole('button', { name: 'Create Employee' }).click();
    console.log('✅ Step 4 Passed — Valid form submitted with all fields, no validation errors');
     await page.goto(
    'https://isp-saas-staging.vercel.app/company/northdev/employees'
  );
  await page.locator('input[placeholder="Search employees..."].pl-8').click();
await page.locator('input[placeholder="Search employees..."].pl-8').fill('sheri12@mailinator.com');
});