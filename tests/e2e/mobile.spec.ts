import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mobileStacks } from '../../src/content/mobile';

async function chooseRoleAndTier(page: Page, role: string, tier = 'Junior') {
  await page.goto('/onboarding');
  await page.getByRole('radio', { name: new RegExp(`^${role}`) }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('radio', { name: new RegExp(`^${tier}`) }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
}

test('all cross-platform and native stacks enroll and restore as distinct mobile paths', async ({
  page,
}) => {
  for (const stack of mobileStacks) {
    await chooseRoleAndTier(page, 'Mobile');
    await page
      .getByRole('radio', { name: new RegExp(`^${stack.label.replace(/[()]/g, '\\$&')}`) })
      .check();
    if (stack.id === 'react-native') await page.getByRole('radio', { name: /^JavaScript/ }).check();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.locator('.plan-summary')).toContainText(stack.label);
    await page.getByRole('button', { name: 'Build my path' }).click();
    await expect(page.locator('.current-path')).toContainText(stack.label);
    await expect(page.locator('.current-path')).toContainText('0 of 4 modules');
    await page.reload();
    await expect(page.locator('.current-path')).toContainText(stack.label);
    await page.goto('/practice/practical');
    await page.getByRole('tab', { name: /Exercise/ }).click();
    await expect(page.locator('main')).toContainText(stack.label);
  }
  await page.goto('/onboarding');
  await expect(page.locator('.saved-path-list').getByRole('button')).toHaveCount(6);
  await page
    .locator('.saved-path-list')
    .getByRole('button', { name: /Flutter/ })
    .click();
  await expect(page.locator('.current-path')).toContainText('Flutter');
});

test('fullstack mobile keeps backend language, adds a fifth module, and retains optional AI', async ({
  page,
}) => {
  await chooseRoleAndTier(page, 'Fullstack', 'Mid-level');
  await page.getByRole('radio', { name: /^Python/ }).check();
  await page.getByRole('checkbox', { name: /Include mobile development/ }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Choose a mobile stack');
  await expect(page.getByRole('radio', { name: /^Flutter/ })).toBeFocused();
  await page.getByRole('radio', { name: /^Flutter/ }).check();
  await expect(page.getByRole('radio', { name: /^Python/ })).toBeChecked();
  await page.screenshot({ path: 'artifacts/fullstack-mobile-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('checkbox', { name: /Include AI workflow preparation/ }).check();
  await page.getByRole('button', { name: 'Build my path' }).click();
  await expect(page.locator('.current-path')).toContainText('Python backend · Mobile: Flutter');
  await expect(page.locator('.current-path')).toContainText('0 of 5 modules');
  await page.goto('/path');
  await expect(page.getByRole('heading', { name: 'Mobile development · Flutter' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI-assisted engineering' })).toBeVisible();
  await page.getByRole('heading', { name: 'Mobile development · Flutter' }).click();
  await expect(page.locator('main')).toContainText('Module 4 of 5');
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await page
    .getByRole('textbox')
    .fill('Persist the draft locally and synchronize with a stable operation ID.');
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: /Exercise/ }).click();
  await expect(page.getByRole('textbox')).toHaveValue(/Persist the draft/);
  await page.goto('/progress');
  await expect(page.getByText('0 of 5 required modules complete')).toBeVisible();
  await page.goto('/settings');
  await expect(page.locator('main')).toContainText('Python backend · Mobile: Flutter');
});

test('stack selection validates, switches languages, and remains accessible on a narrow dark screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await chooseRoleAndTier(page, 'Mobile', 'Senior');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Choose a mobile stack');
  await expect(page.getByRole('radio', { name: /^Flutter/ })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio', { name: /^Dart/ })).toBeChecked();
  await page.getByRole('radio', { name: /^iOS \(Swift\)/ }).check();
  await expect(page.getByRole('radio', { name: /^Swift/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /^Dart/ })).toHaveCount(0);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('heading', { name: 'Choose your mobile stack.' }).focus();
  await page.screenshot({ path: 'artifacts/mobile-stack-selection.png', fullPage: true });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Build my path' }).click();
  await page.goto('/settings');
  await page.getByRole('radio', { name: 'Dark', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await chooseRoleAndTier(page, 'Mobile');
  await page.getByRole('radio', { name: /^Android \(Java\)/ }).check();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.getByRole('heading', { name: 'Choose your mobile stack.' }).focus();
  await page.screenshot({ path: 'artifacts/mobile-stack-selection-dark.png', fullPage: true });
});

test('removing the fullstack mobile option clears the stack and keeps the original four-module path', async ({
  page,
}) => {
  await chooseRoleAndTier(page, 'Fullstack');
  await page.getByRole('radio', { name: /^Java\s/ }).check();
  const mobile = page.getByRole('checkbox', { name: /Include mobile development/ });
  await mobile.check();
  await page.getByRole('radio', { name: /^Android \(Kotlin\)/ }).check();
  await mobile.uncheck();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('.plan-summary')).not.toContainText('Mobile stack');
  await page.getByRole('button', { name: 'Build my path' }).click();
  await expect(page.locator('.current-path')).toContainText('0 of 4 modules');
  await page.goto('/path');
  await expect(page.getByRole('heading', { name: /Mobile development/ })).toHaveCount(0);
});

test('going back and changing role clears incompatible mobile selections', async ({ page }) => {
  await chooseRoleAndTier(page, 'Mobile');
  await page.getByRole('radio', { name: /^Flutter/ }).check();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('radio', { name: /^Frontend/ }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('radio', { name: /^Dart/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Choose a language');
  await page.getByRole('radio', { name: /^TypeScript/ }).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('.plan-summary')).not.toContainText('Mobile stack');
  await page.getByRole('button', { name: 'Build my path' }).click();
  await expect(page.locator('.current-path')).toContainText('Junior Frontend developer');
});
