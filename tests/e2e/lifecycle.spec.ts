import { test, expect } from '@playwright/test';
import { enrollPath } from './helpers';

test('unenroll retains a draft, reenroll resumes it, reset clears only the selected path', async ({
  page,
}) => {
  await enrollPath(page);
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await page
    .getByLabel('Your response')
    .fill('A saved explanation that should survive unenrollment.');
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Unenroll', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Unenroll', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Unenroll', exact: true }).click();
  await dialog.getByRole('button', { name: 'Unenroll', exact: true }).click();
  await expect(page).toHaveURL(/onboarding/);
  await page.getByRole('button', { name: 'Junior Frontend · TypeScript' }).click();
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toHaveValue(/survive unenrollment/);
  await enrollPath(page, 'Backend', 'Senior', 'Go');
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toBeEmpty();
  await page.getByLabel('Your response').fill('Separate Go profile.');
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Reset path', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset path', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Path progress reset');
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toBeEmpty();
  await page.goto('/onboarding');
  await page.getByRole('button', { name: 'Junior Frontend · TypeScript' }).click();
  await page.goto('/practice/fundamentals');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toHaveValue(/survive unenrollment/);
});

test('AI settings preserve work and remain separate from core progress', async ({ page }) => {
  await enrollPath(page, 'Fullstack', 'Mid-level', 'Java', true);
  await page.goto('/practice/ai');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await page
    .getByLabel('Your response')
    .fill('Review ownership, idempotency, and failure recovery.');
  await page.goto('/settings');
  await page.getByRole('checkbox', { name: /Include AI workflow preparation/ }).uncheck();
  await page.getByRole('checkbox', { name: /Include AI workflow preparation/ }).check();
  await page.goto('/practice/ai');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByLabel('Your response')).toHaveValue(/idempotency/);
  await page.goto('/progress');
  await expect(page.getByText('0 of 4 required modules complete')).toBeVisible();
});
