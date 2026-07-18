import { test, expect } from '@playwright/test';
import { profile } from '@/content/profile';

test.describe('personal website', () => {
  test('hero establishes identity and its own top contact links', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // The h1 renders "Valeria" and "Chacon" as separate per-word spans
    // (aria-hidden, laid out with CSS `gap` around the PixelVC monogram)
    // rather than a literal space character, so raw textContent would read
    // "ValeriaChacon". The accessible name (set via aria-label on the h1
    // itself) is what screen readers and users actually rely on, so assert
    // on that instead of text matching.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Valeria Chacon');

    // The new hero only carries an email link (top-left) and a LinkedIn
    // link (top-right) in the viewport — Résumé/GitHub moved to the footer
    // (see the "footer links are reachable" test below). Scope to the
    // <header> so this can't accidentally match the footer's own email/
    // LinkedIn links.
    const hero = page.locator('header');
    await expect(hero.getByRole('link', { name: profile.email, exact: true })).toBeInViewport();
    await expect(hero.getByRole('link', { name: 'LinkedIn', exact: true })).toBeInViewport();
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

  test('speedup section tells the 180x story', async ({ page }) => {
    await page.goto('/');
    const speedup = page.locator('#speedup');
    await speedup.scrollIntoViewIfNeeded();
    // Static text (not a JS count-up — Speedup renders formatClock(FROM/TO)
    // directly), so this is stable regardless of the Reveal fade-in.
    await expect(speedup.getByText('30:00', { exact: true })).toBeVisible();
    await expect(speedup.getByText('0:10', { exact: true })).toBeVisible();
    // "180" legitimately appears twice in this section — the multiplier
    // display ("180×") and the bullet copy ("...roughly a 180× speedup").
    // Anchor to the multiplier paragraph specifically (its text starts with
    // "180") rather than an unscoped getByText, which hits both and throws
    // a strict-mode violation.
    await expect(speedup.locator('p', { hasText: /^180/ })).toBeVisible();
  });

  test('footer links to résumé, GitHub, and LinkedIn are reachable', async ({ page }) => {
    await page.goto('/');
    // These links live in the footer now, not the hero viewport (see the
    // "hero establishes identity" test above) — scope to <footer id="contact">
    // so this can't accidentally match the hero's own LinkedIn link.
    const footer = page.locator('footer#contact');
    await footer.scrollIntoViewIfNeeded();

    const resumeLink = footer.getByRole('link', { name: 'Résumé', exact: true });
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute('href', profile.resume);

    const githubLink = footer.getByRole('link', { name: 'GitHub', exact: true });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', profile.github);

    const linkedinLink = footer.getByRole('link', { name: 'LinkedIn', exact: true });
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('href', profile.linkedin);
  });

  test('command palette opens, filters, and closes', async ({ page }) => {
    await page.goto('/');
    // The palette's keydown listener is registered in a useEffect after
    // hydration. Sending the shortcut immediately after goto() races that
    // registration — reproducibly flaky by the ~5th navigation in a shared
    // worker (confirmed independent of any other test in this file: a
    // throwaway suite of plain `goto()`-only tests followed by this same
    // keypress fails the same way). Waiting for the network to go idle is a
    // web-first proxy for "the client bundle has run" and removes the race.
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('ControlOrMeta+k');
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await page.getByLabel('Search commands').fill('sprout');
    await expect(dialog.getByRole('button', { name: /SproutFund/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('skills fallback list stays in the accessibility tree once physics boots', async ({ page }) => {
    await page.goto('/');
    // Region name comes from the section's own heading (aria-labelledby),
    // not the generic word "Skills" — the redesign's heading copy is
    // "CODING SINCE 2019". Scoped to this region: "DynamoDB" and "Spring
    // Boot" also legitimately appear in the Return timeline / Speedup stack
    // lists, so an unscoped page-wide query would be ambiguous by design.
    const skillsSection = page.getByRole('region', { name: 'CODING SINCE 2019' });
    await skillsSection.scrollIntoViewIfNeeded();

    // Physics boots asynchronously (dynamic import of matter-js, gated by an
    // IntersectionObserver) once the section scrolls into view. Wait for the
    // matter-js canvas to actually appear so this test exercises the
    // post-boot state described in Skills.tsx's own comment, not just the
    // pre-boot fallback.
    await expect(skillsSection.locator('canvas')).toBeVisible({ timeout: 10_000 });

    const dynamoItem = skillsSection.getByRole('listitem').filter({ hasText: /^DynamoDB$/ });
    const springItem = skillsSection.getByRole('listitem').filter({ hasText: /^Spring Boot$/ });
    await expect(dynamoItem).toBeAttached();
    await expect(springItem).toBeAttached();

    // toBeAttached() only proves the node is still in the DOM — it would
    // also pass for `display: none`, which is exactly the regression this
    // guarantee exists to catch (display:none removes a node from the
    // accessibility tree; the visually-hidden technique in Skills.module.css
    // does not). Assert the actual computed style directly.
    const display = await dynamoItem.evaluate((el) => getComputedStyle(el).display);
    expect(display).not.toBe('none');
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
