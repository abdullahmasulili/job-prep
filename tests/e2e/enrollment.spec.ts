import { test, expect } from '@playwright/test';
import { enrollPath } from './helpers';

test('onboarding creates a specific role/tier/language path and restores it', async ({ page }) => {
  await enrollPath(page, 'Backend', 'Mid-level', 'Python', true);
  await expect(page.getByRole('heading', { name: /Your next chapter/ })).toBeVisible();
  await expect(
    page.getByText('Mid-level Backend developer', { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText('0 of 4 modules', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(
    page.getByText('Mid-level Backend developer', { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole('link', { name: 'My path', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'AI-assisted engineering' })).toBeVisible();
});

test('choice is required and onboarding works with the keyboard', async ({ page }) => {
  await page.goto('/onboarding');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Choose a role');
  await expect(page.getByRole('radio', { name: /^Frontend/ })).toBeFocused();
  await page.getByRole('radio', { name: /^Frontend/ }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio', { name: /^Frontend/ })).toBeChecked();
});
