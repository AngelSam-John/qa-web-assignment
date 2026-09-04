import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly navigation: Locator;
  readonly menu: Locator;
  readonly homeMenuItem: Locator;
  readonly productsMenuItem: Locator;
  readonly contactMenuItem: Locator;
  readonly userAvatar: Locator;
  readonly logoutButton: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    this.navigation = page.getByRole('navigation');
    this.menu = page.locator('nav.navigation section.menu');
    this.homeMenuItem = this.menu.locator('div.home');
    this.productsMenuItem = this.menu.locator('div.products');
    this.contactMenuItem = this.menu.locator('div.contact');
    this.userAvatar = page.locator('.user-section');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.content = page.locator('section.content');
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.navigation).toBeVisible();
    await expect(this.userAvatar).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async expectMenuItems(): Promise<void> {
    await expect(this.homeMenuItem).toBeVisible();
    await expect(this.homeMenuItem).toHaveText('Home');

    await expect(this.productsMenuItem).toBeVisible();
    await expect(this.productsMenuItem).toHaveText('Products');

    await expect(this.contactMenuItem).toBeVisible();
    await expect(this.contactMenuItem).toHaveText('Contact');
  }
}