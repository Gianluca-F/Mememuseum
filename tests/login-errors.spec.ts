import { test, expect } from '@playwright/test';

test.describe('login errors', () => {
    test('login fails with invalid credentials', async ({ page }) => {
        await page.goto('http://localhost:4200/home');
        await page.getByRole('link', { name: 'Log In' }).click();
        await page.getByRole('textbox', { name: 'Your username' }).fill('invalidUser');
        await page.getByRole('textbox', { name: 'Password' }).fill('invalidPassword');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.getByLabel('Oops! Could not log in')).toBeVisible();
    });

    test('login fails with invalid form data', async ({ page }) => {
        await page.goto('http://localhost:4200/home');
        await page.getByRole('link', { name: 'Log In' }).click();
        await page.getByRole('textbox', { name: 'Your username' }).fill('ab');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.getByLabel('Oops! Invalid data!')).toBeVisible();
    });
});