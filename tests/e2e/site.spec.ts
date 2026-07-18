import { test, expect } from '@playwright/test';

test.describe('personal website', () => {
  test('hero shows identity and all three links without scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // The h1 renders "Valeria" and "Chacon" as separate per-word spans
    // (each animated letter-by-letter) laid out with CSS `gap` rather than a
    // literal space character, so raw textContent reads "ValeriaChacon".
    // The accessible name (set via aria-label) is what screen readers and
    // users actually rely on, so assert on that instead of textContent.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Valeria Chacon');
    await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'GitHub' }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Email' }).first()).toBeInViewport();
  });

  test('never shows excluded retail employers', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Best Buy/i);
    expect(body).not.toMatch(/Meta Specialist/i);
  });

  test('credits SproutFund as a team effort', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Led a 4-person team/)).toBeVisible();
  });

  test('command palette opens, filters, and closes', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await page.getByLabel('Search commands').fill('sprout');
    await expect(dialog.getByRole('button', { name: /SproutFund/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('reduced motion renders the final clock immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByText('0:10')).toBeVisible();
  });

  test('skills stay readable by assistive tech once physics boots', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { name: 'Skills' }).scrollIntoViewIfNeeded();
    // The canvas is aria-hidden, so this list is the only accessible source.
    // It may be visually hidden, but it must never leave the a11y tree.
    // Scoped to the Skills region: "DynamoDB" also legitimately appears in
    // the Return timeline and Speedup stack (it's part of that role's real
    // tech stack), so an unscoped page-wide query is ambiguous by design.
    const skillsSection = page.getByRole('region', { name: 'Skills' });
    await expect(skillsSection.getByRole('listitem').filter({ hasText: /^DynamoDB$/ })).toBeAttached();
    await expect(skillsSection.getByRole('listitem').filter({ hasText: /^Spring Boot$/ })).toBeAttached();
  });

  test('mobile does not scroll horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2500);
    expect(errors).toEqual([]);
  });
});
