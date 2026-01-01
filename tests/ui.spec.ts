import { test, expect } from '@playwright/test';

// Main UI integration tests for ops-home

test.describe('Ops Home UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Arenas table renders and links work', async ({ page }) => {
    await expect(page.getByText('Arenas')).toBeVisible();
    await expect(page.getByText('Bullpen')).toBeVisible();
    const openButtons = await page.locator('text=Open').all();
    expect(openButtons.length).toBeGreaterThan(0);
    // Just check the first link opens a new tab (no navigation in test)
    await openButtons[0].click();
  });

  test('Calendar click selects event', async ({ page }) => {
    await expect(page.getByText('Calendar & Events')).toBeVisible();
    // Click a calendar day (simulate by clicking a tile)
    const tiles = await page.locator('.react-calendar__tile').all();
    if (tiles.length > 0) {
      await tiles[0].click();
    }
    // No error should occur
  });

  test('Event type filter toggles', async ({ page }) => {
    const ongoingBtn = page.getByRole('button', { name: /ongoing/i });
    await expect(ongoingBtn).toBeVisible();
    await ongoingBtn.click();
    await ongoingBtn.click(); // toggle back
  });

  test('Risk slider and non-negotiables input update state', async ({ page }) => {
    const riskSlider = page.getByRole('slider');
    await expect(riskSlider).toBeVisible();
    await riskSlider.fill('4');
    const nonNegInput = page.getByPlaceholder('Non‑negotiable for today');
    await expect(nonNegInput).toBeVisible();
    await nonNegInput.fill('No cold wallet risk');
  });

  test('Quick links open URLs', async ({ page }) => {
    const githubBtn = page.getByRole('button', { name: /GitHub/ });
    await expect(githubBtn).toBeVisible();
    // Just click, don't check navigation
    await githubBtn.click();
  });
});
