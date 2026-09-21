import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Design Standards & Accessibility Enforcement', () => {
  test('A11y Audit: Merchant Home Dashboard', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Run Axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Ideally, violations should be 0. We'll assert that there are no critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations.length).toBe(0);
  });

  test('A11y Audit: Merchant Setup Form', async ({ page }) => {
    await page.goto('/merchant-setup');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations.length).toBe(0);
  });

  test('CSS Standards: Verify Brand Color & Typography', async ({ page }) => {
    await page.goto('/mobile-number');
    await page.waitForSelector('button:has-text("Get OTP & Verify")');

    const button = page.locator('button:has-text("Get OTP & Verify")');

    // Enable the button by filling out the form to test its active state
    await page.fill('#owner-name-input', 'Test Name');
    await page.fill('#merchant-phone-input', '501234567');

    // Evaluate computed styles
    const computedStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
      };
    });

    // #00C853 translates to rgb(0, 200, 83)
    expect(computedStyles.backgroundColor).toBe('rgb(0, 200, 83)');
    expect(computedStyles.borderRadius).toBe('14px');

    // Verify background of the screen is dark #080C14 -> rgb(8, 12, 20)
    const bodyStyles = await page.evaluate(() => {
      const firstDiv = document.querySelector('.fade-in') as HTMLElement;
      if (!firstDiv) return null;
      const styles = window.getComputedStyle(firstDiv);
      return { backgroundColor: styles.backgroundColor };
    });

    expect(bodyStyles?.backgroundColor).toBe('rgb(8, 12, 20)');
  });
});
