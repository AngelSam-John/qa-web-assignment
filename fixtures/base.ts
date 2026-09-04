import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

type AppFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };