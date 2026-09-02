import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
	readonly usernameInput : Locator;
	readonly passwordInput : Locator;
	readonly loginButton : Locator;

	constructor(readonly page : Page) {
		this.usernameInput = page.getByPlaceholder('E-mail address');
		this.passwordInput = page.locator('#password');
		this.loginButton = page.getByRole('button', {name : 'LOGIN' })
		this.logoutButton = page.getByRole('button', { name: 'Logout' });
		this.errorMessage = page.locator('.error-message');
		}

	async login(username: string, password: string) : Promise<void> {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
		}
	}
