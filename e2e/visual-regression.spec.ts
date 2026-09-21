import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing & Layout Assertions', () => {
  // Define standard viewport for baseline capture
  test.use({ viewport: { width: 393, height: 852 } }); // iPhone 14 Pro size

  test('Snapshot: Auth - Merchant Login Screen', async ({ page }) => {
    await page.goto('/mobile-number');
    await page.waitForLoadState('networkidle');
    // Hide blinking cursor if any, wait for fonts to load
    await expect(page.locator('text=Merchant Login')).toBeVisible();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('auth-login-screen.png');
  });

  test('Snapshot: Auth - OTP Screen', async ({ page }) => {
    await page.goto('/sms-otp?mobile=501234567&name=Fahad');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Enter Verification Code')).toBeVisible();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('auth-otp-screen.png');
  });

  test('Snapshot: Dashboard - English (LTR)', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await expect(page.locator("text=Today's Collection")).toBeVisible();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('dashboard-ltr.png');
  });

  test('Snapshot: Dashboard - Arabic (RTL)', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Switch to Arabic
    const langPill = page.locator('button[title="التحويل إلى اللغة العربية"], button[aria-label="Switch language to Arabic"]');
    await langPill.click();
    
    // Wait for the UI to transition and re-render
    await expect(page.locator('text=تحصيلات اليوم')).toBeVisible();
    
    // Wait a brief moment for transition animations to settle
    await page.waitForTimeout(500);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('dashboard-rtl.png');
  });
});
