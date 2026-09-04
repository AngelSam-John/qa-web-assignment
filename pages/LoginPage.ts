import { expect, type Locator, type Page } from '@playwright/test';

export const LOCAL_STORAGE_KEY = 'logged';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.form = page.locator('section.login form');
    this.emailInput = page.getByLabel('User', { exact: true });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.loginButton.click();
  }

  async loginWithKeyboard(
    email: string,
    password: string
  ): Promise<void> {
    await this.fillCredentials(email, password);
    await this.passwordInput.press('Enter');
  }

  async fillCredentials(
    email: string,
    password: string
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async expectLoginFormReady(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.errorMessage).toBeHidden();
  }

  async expectLoginRejected(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedMessage);
    await expect(this.loginButton).toBeVisible();
  }

  async getStoredSession(): Promise<string | null> {
    return this.page.evaluate(
      (key) => window.localStorage.getItem(key),
      LOCAL_STORAGE_KEY
    );
  }
}