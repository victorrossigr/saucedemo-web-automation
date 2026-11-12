import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages-objects/login'

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login with valid user', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('login with locked user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('login with wrong password', async () => {
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectError('Username and password do not match');
  });

  test('login with invalid username', async () => {
    await loginPage.login('invalid_user', 'secret_sauce');

    await loginPage.expectError('Username and password do not match');
  });
});