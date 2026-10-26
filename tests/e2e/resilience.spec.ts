import { test, expect } from '@playwright/test';
import { enrollPath } from './helpers';
const key = 'jobprep.progress.v1';
test('corrupt data is preserved until explicit confirmed recovery', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((k) => localStorage.setItem(k, '{broken-data'), key);
  await page.reload();
  await expect(page.getByText('Your saved data needs attention', { exact: true })).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe('{broken-data');
  await page.getByRole('button', { name: 'Reset local data', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe('{broken-data');
  await page.getByRole('button', { name: 'Reset local data', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Reset local data', exact: true })
    .click();
  await expect(
    page.getByText('Your saved data needs attention', { exact: true }),
  ).not.toBeVisible();
  expect(
    JSON.parse((await page.evaluate((k) => localStorage.getItem(k), key))!).schemaVersion,
  ).toBe(1);
});
test('unavailable storage allows in-memory practice with an honest persistent warning', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Denied', 'SecurityError');
      },
    }),
  );
  await enrollPath(page);
  await expect(page.getByText('Progress is not saved', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'My path', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'One step closer, every session.' }),
  ).toBeVisible();
});
test('a second tab causes a conflict and stale state cannot overwrite newer progress', async ({
  page,
  context,
}) => {
  await enrollPath(page);
  await page.goto('/settings');
  const second = await context.newPage();
  await second.goto('/settings');
  await second.getByRole('radio', { name: 'Dark', exact: true }).check();
  await expect(page.getByText('Another tab has newer progress', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Load latest progress' }).click();
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await expect(page.getByText('Another tab has newer progress', { exact: true })).not.toBeVisible();
});

test('overlapping tab edits cannot both commit the same base revision', async ({
  page,
  context,
}) => {
  await enrollPath(page);
  await page.goto('/settings');
  const second = await context.newPage();
  await second.goto('/settings');
  await expect(second.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
  const blocker = await context.newPage();
  await blocker.goto('/settings');
  await blocker.evaluate(async () => {
    const holder = window as Window & { releaseProgressLock?: () => void };
    let started: () => void;
    const ready = new Promise<void>((resolve) => {
      started = resolve;
    });
    void navigator.locks.request(
      'jobprep.progress.v1',
      () =>
        new Promise<void>((resolve) => {
          holder.releaseProgressLock = resolve;
          started();
        }),
    );
    await ready;
  });
  await page.getByRole('radio', { name: 'Dark', exact: true }).check();
  await second.getByRole('checkbox', { name: /Include AI workflow preparation/ }).check();
  await expect(page.getByText('Saving on this device', { exact: true })).toBeVisible();
  await expect(second.getByText('Saving on this device', { exact: true })).toBeVisible();
  await blocker.evaluate(() =>
    (window as Window & { releaseProgressLock?: () => void }).releaseProgressLock?.(),
  );
  await expect(second.getByText('Another tab has newer progress', { exact: true })).toBeVisible();
  const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
  expect(saved.theme).toBe('dark');
  expect(saved.profiles[saved.activeId].aiEnabled).toBe(false);
});
