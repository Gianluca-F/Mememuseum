import { test, expect } from '@playwright/test';

test('meme of the day correctly displays', async ({ page }) => {
  await page.goto('http://localhost:4200/home');

  const hamburgerMenuButton = page.getByRole('button', { name: 'Toggle mobile menu' });
  if (await hamburgerMenuButton.isVisible()) {
    await hamburgerMenuButton.click();
  }
  const motdLink = page.getByRole('link', { name: 'Meme of the Day' });
  await expect(motdLink).toBeVisible();
  await motdLink.click();
  
  await expect(page).toHaveURL(/\/meme-of-the-day$/);
  await expect(page).toHaveTitle('Meme of the Day | Meme Museum');
  await expect(page.getByText('Could not find this meme.')).toBeHidden();
  await expect(page.getByText('Uploaded by')).toBeVisible();
});