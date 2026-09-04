import { expect, test } from '../fixtures/base';
import {
  invalidLoginCases,
  LOGIN_ERROR_MESSAGE,
  PRIMARY_USER,
  validUsers,
} from '../test-data/loginData';

test.describe('Login functionality', () => {
  test.describe('Successful authentication', () => {
    // Verify every account supplied by the application because login behaviour
    // should remain consistent across all registered users.
    for (const user of validUsers) {
      test(
        `logs in with valid credentials for ${user.email}`,
        {
          tag: ['@smoke', '@login'],
        },
        async ({ loginPage, homePage }) => {
          await test.step('submit valid credentials', async () => {
            await loginPage.login(user.email, user.password);
          });

          await test.step('the authenticated view is rendered', async () => {
            await homePage.expectLoggedIn();
            await expect(loginPage.loginButton).toBeHidden();
          });

          await test.step(
            'the session is persisted for that account',
            async () => {
              expect(await loginPage.getStoredSession()).toBe(user.email);
            }
          );
        }
      );
    }

    test(
      'logs in by pressing Enter instead of clicking LOGIN',
      {
        tag: ['@login'],
      },
      async ({ loginPage, homePage }) => {
        await loginPage.loginWithKeyboard(
          PRIMARY_USER.email,
          PRIMARY_USER.password
        );

        await homePage.expectLoggedIn();
      }
    );

    test(
      'shows the Home, Products and Contact menu items after signing in',
      {
        tag: ['@smoke', '@login'],
      },
      async ({ loginPage, homePage }) => {
        await loginPage.login(
          PRIMARY_USER.email,
          PRIMARY_USER.password
        );

        await homePage.expectLoggedIn();
        await homePage.expectMenuItems();
      }
    );

    // Verify that failed attempts do not leave the form in a state that prevents
    // a subsequent valid login.
    test(
      'logs in successfully after previous failed attempts',
      {
        tag: ['@login'],
      },
      async ({ loginPage, homePage }) => {
        await test.step('fail to log in three times', async () => {
          for (let attempt = 0; attempt < 3; attempt++) {
            await loginPage.login(
              PRIMARY_USER.email,
              `wrong-password-${attempt}`
            );
            await loginPage.expectLoginRejected(LOGIN_ERROR_MESSAGE);
          }
        });

        await test.step('the correct credentials still work', async () => {
          await loginPage.login(
            PRIMARY_USER.email,
            PRIMARY_USER.password
          );
          await homePage.expectLoggedIn();
        });
      }
    );
  });

  test.describe('Rejected authentication', () => {
    // Use one generic error for all rejected credentials to avoid revealing
    // whether a specific account exists.
    for (const testCase of invalidLoginCases) {
      test(
        `rejects ${testCase.name}`,
        {
          tag: ['@login', '@negative'],
        },
        async ({ loginPage, homePage }) => {
          await test.step('submit the invalid credentials', async () => {
            await loginPage.login(
              testCase.email,
              testCase.password
            );
          });

          await test.step('a generic error is shown', async () => {
            await loginPage.expectLoginRejected(
              testCase.expectedMessage
            );
          });

          await test.step('no session is created', async () => {
            await expect(homePage.logoutButton).toBeHidden();
            await expect(homePage.navigation).toBeHidden();
            expect(await loginPage.getStoredSession()).toBeNull();
          });
        }
      );
    }
  });

  test.describe('Form behaviour and usability', () => {
    test(
      'shows only the login form before authentication',
      {
        tag: ['@login'],
      },
      async ({ loginPage, homePage }) => {
        await expect(loginPage.form).toBeVisible();
        await expect(homePage.navigation).toBeHidden();
        await expect(homePage.content).toBeHidden();
        await expect(homePage.logoutButton).toBeHidden();
      }
    );

    // Password values must remain visually masked while being entered.
    test(
      'masks the password as it is typed',
      {
        tag: ['@login'],
      },
      async ({ loginPage }) => {
        await expect(loginPage.passwordInput).toHaveAttribute(
          'type',
          'password'
        );

        await loginPage.passwordInput.fill(PRIMARY_USER.password);

        await expect(loginPage.passwordInput).toHaveValue(
          PRIMARY_USER.password
        );
        await expect(loginPage.passwordInput).toHaveAttribute(
          'type',
          'password'
        );
      }
    );

    // A previous authentication error should disappear when the user starts
    // correcting the submitted credentials.
    test(
      'clears the error message as soon as the user edits a field',
      {
        tag: ['@login'],
      },
      async ({ loginPage }) => {
        await test.step('trigger an error', async () => {
          await loginPage.login(
            PRIMARY_USER.email,
            'wrong-password'
          );
          await expect(loginPage.errorMessage).toBeVisible();
        });

        await test.step('editing the password clears it', async () => {
          await loginPage.passwordInput.fill('a');
          await expect(loginPage.errorMessage).toBeHidden();
        });

        await test.step('editing the email clears it too', async () => {
          await loginPage.login(
            PRIMARY_USER.email,
            'wrong-password'
          );
          await expect(loginPage.errorMessage).toBeVisible();

          await loginPage.emailInput.fill('b');
          await expect(loginPage.errorMessage).toBeHidden();
        });
      }
    );
  });

  test.describe('Input handling and security', () => {
    // Credential values must be treated as plain text and must never be rendered
    // or executed as HTML.
    test(
      'never executes markup submitted through the credential fields',
      {
        tag: ['@login'],
      },
      async ({ loginPage, page }) => {
        let dialogWasOpened = false;

        page.on('dialog', async (dialog) => {
          dialogWasOpened = true;
          await dialog.dismiss();
        });

        await loginPage.login(
          '<img src=x onerror="alert(1)">',
          '<b>bold</b>'
        );

        await loginPage.expectLoginRejected(LOGIN_ERROR_MESSAGE);

        expect(
          dialogWasOpened,
          'an injected script managed to open a dialog'
        ).toBe(false);

        await expect(page.locator('img[src="x"]')).toHaveCount(0);
        await expect(
          page.locator('.error-message b')
        ).toHaveCount(0);
      }
    );

    // Authentication state may be persisted, but the plaintext password must
    // never be written to browser storage.
    test(
      'never persists the password in browser storage',
      {
        tag: ['@login'],
      },
      async ({ loginPage, homePage, page }) => {
        await loginPage.login(
          PRIMARY_USER.email,
          PRIMARY_USER.password
        );
        await homePage.expectLoggedIn();

        const storage = await page.evaluate(() =>
          JSON.stringify(localStorage)
        );

        expect(storage).not.toContain(PRIMARY_USER.password);
        expect(await loginPage.getStoredSession()).toBe(
          PRIMARY_USER.email
        );
      }
    );
  });
});