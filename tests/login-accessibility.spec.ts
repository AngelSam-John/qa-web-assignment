import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login accessibility', () => {
  test('has no automatically detectable accessibility violations', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await expect(loginPage.loginButton).toBeVisible();

    const accessibilityResults = await new AxeBuilder({ page }).analyze();

    expect(
      accessibilityResults.violations,
      JSON.stringify(accessibilityResults.violations, null, 2)
    ).toEqual([]);
  });
});