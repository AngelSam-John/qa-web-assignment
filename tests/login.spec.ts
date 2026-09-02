import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../js/users.js';
import { invalidLoginCases } from '../test-data/loginData';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  users.forEach(({ email, password }) => {
    test(`successfully logs in with valid credentials for ${email}`, async () => {
      await loginPage.login(email, password);

      await expect(loginPage.logoutButton).toBeVisible();
    });
  });

  invalidLoginCases.forEach(
    ({ name, email, password, expectedMessage }) => {
      test(`displays an authentication error for ${name}`, async () => {
        await loginPage.login(email, password);

        await expect(loginPage.errorMessage).toHaveText(expectedMessage);
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.logoutButton).not.toBeVisible();
      });
    }
  );

  test('masks the password value', async () => {
    await expect(loginPage.passwordInput).toHaveAttribute(
      'type',
      'password'
    );
  });

  test('allows a valid user to log in using the Enter key', async () => {
    const validUser = users[0];

    await loginPage.usernameInput.fill(validUser.email);
    await loginPage.passwordInput.fill(validUser.password);
    await loginPage.passwordInput.press('Enter');

    await expect(loginPage.logoutButton).toBeVisible();
  });
});