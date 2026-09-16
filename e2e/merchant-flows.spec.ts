import { test, expect } from '@playwright/test';

test.describe('Saudi Merchant App Flow QA', () => {
  test('1. Splash and Onboarding Flow', async ({ page }) => {
    await page.goto('/?screen=SPLASH');
    await expect(page.locator('text=QUICK | TRUSTED | PAYMENTS')).toBeVisible();
    await expect(page.locator('text=powered by')).toBeVisible();
  });

  test('2. Merchant Dashboard, SettleNow, and Working Capital', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_HOME');
    await expect(page.locator('button[aria-label="Store Profile"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Notifications"]')).toBeVisible();
    await expect(page.locator('text=Smart Soundbox Pro')).toBeVisible();
    await expect(page.locator("text=Today's Collection")).toBeVisible();
    await expect(page.locator('text=Accept Payment')).toBeVisible();
    await expect(page.locator('text=Recent Payments')).toBeVisible();

    // Trigger SettleNow
    const settleBtn = page.locator('button:has-text("Settle Now")').first();
    await expect(settleBtn).toBeVisible();
    await settleBtn.click();
  });

  test('3. Dual-Tab Collections and Settlements Ledger', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_COLLECTIONS');
    await expect(page.locator('text=Collections & Settlements')).toBeVisible();
    await expect(page.locator('button:has-text("Collections")')).toBeVisible();
    await expect(page.locator('button:has-text("Settlements")')).toBeVisible();

    // Switch to Settlements Tab
    await page.click('button:has-text("Settlements")');
    await expect(page.locator('text=Sarie Settlement History')).toBeVisible();
    await expect(page.locator('text=Sarie UTR').first()).toBeVisible();
    await expect(page.locator('button:has-text("Download VAT Invoice")').first()).toBeVisible();
  });

  test('4. My Store QR Stand Hub (Static and Dynamic)', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_QR_GENERATOR');
    await expect(page.locator('text=Store QR Hub')).toBeVisible();
    await expect(page.locator('button:has-text("Store Stand QR")')).toBeVisible();
    await expect(page.locator('button:has-text("Dynamic Invoice QR")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Stand Poster")')).toBeVisible();
    await expect(page.locator('button:has-text("Share via WhatsApp")')).toBeVisible();

    // Switch to Dynamic Invoice QR
    await page.click('button:has-text("Dynamic Invoice QR")');
    await expect(page.locator('text=Invoice Total (SAR)')).toBeVisible();
    await expect(page.locator('text=Includes SAR')).toBeVisible();
  });

  test('5. SoftPOS Keypad and Card Tap Simulation', async ({ page }) => {
    await page.goto('/?screen=SOFTPOS_TERMINAL');
    await expect(page.locator('text=SoftPOS Terminal').first()).toBeVisible();
    await expect(page.locator('text=Debit').first()).toBeVisible();
    await expect(page.locator('button:has-text("Charge")').first()).toBeVisible();

    await page.click('button:has-text("Charge")');
    await expect(page.locator('text=Hold Card or Phone to Back of Device')).toBeVisible();
  });

  test('6. Smart SoundBox Notifier', async ({ page }) => {
    await page.goto('/?screen=SOUNDBOX_NOTIFIER');
    await expect(page.locator('text=QTPay Smart SoundBox')).toBeVisible();
    await expect(page.locator('text=Voice Announcement Language')).toBeVisible();
    await expect(page.locator('text=Trigger Audio Test Announcement')).toBeVisible();
  });

  test('7. My Store Profile Hub & Business Management', async ({ page }) => {
    await page.goto('/?screen=PROFILE');
    await expect(page.locator('text=My Store').first()).toBeVisible();
    await expect(page.locator('text=SETTLEMENT ACCOUNT')).toBeVisible();
    await expect(page.locator('text=Al Rajhi Bank')).toBeVisible();
    await expect(page.locator('text=Primary')).toBeVisible();
    await expect(page.locator('text=Business Profile')).toBeVisible();
    await expect(page.locator('text=KYC Verification')).toBeVisible();
    await expect(page.locator('text=Manage QR')).toBeVisible();
    await expect(page.locator('text=Payment Instruments')).toBeVisible();
    await expect(page.locator('text=Manage Staff')).toBeVisible();
    await expect(page.locator('text=App Language')).toBeVisible();
    await expect(page.locator('text=Log Out Account')).toBeVisible();
  });

  test('8. Redesigned Merchant Login Screen', async ({ page }) => {
    await page.goto('/?screen=MOBILE_NUMBER');
    await expect(page.locator('text=Merchant Login')).toBeVisible();
    await expect(page.locator('text=Merchant Owner Name')).toBeVisible();
    await expect(page.locator('text=Phone Number')).toBeVisible();
    await expect(page.locator('text=+966')).toBeVisible();
    await expect(page.locator('button:has-text("Get OTP & Verify")')).toBeVisible();
  });

  test('9. Redesigned Merchant OTP Verification Screen', async ({ page }) => {
    await page.goto('/?screen=SMS_OTP');
    await expect(page.locator('text=Verify OTP')).toBeVisible();
    await expect(page.locator('text=Code sent via SMS to')).toBeVisible();
    await expect(page.locator('button:has-text("Verify & Proceed")')).toBeVisible();
    await expect(page.locator('button:has-text("Autofill")')).toBeVisible();

    // Trigger autofill and verify CTA becomes enabled
    await page.click('button:has-text("Autofill")');
    const verifyBtn = page.locator('button:has-text("Verify & Proceed")');
    await expect(verifyBtn).toBeEnabled();
  });

  test('10. Redesigned Merchant Business Profile Screen', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_SETUP');
    await expect(page.locator('text=Business Profile')).toBeVisible();
    await expect(page.locator('text=Storefront & Brand Logo')).toBeVisible();
    await expect(page.locator('text=Registered Business Name')).toBeVisible();
    await expect(page.locator('text=Business Category')).toBeVisible();
    await expect(page.locator('text=ZATCA VAT ID')).toBeVisible();
    await expect(page.locator('text=City')).toBeVisible();
    await expect(page.locator('text=Postal Code')).toBeVisible();
    await expect(page.locator('button:has-text("Save & Continue")')).toBeVisible();
  });

  test('11. Merchant Insights & Analytics Hub', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_INSIGHTS');
    await expect(page.locator('text=Insights & Analytics')).toBeVisible();
    await expect(page.locator('text=TOTAL SALES')).toBeVisible();
    await expect(page.locator('text=AVG TICKET')).toBeVisible();
    await expect(page.locator('text=SETTLEMENT')).toBeVisible();
    await expect(page.locator('text=Payment Rail Distribution')).toBeVisible();
    await expect(page.locator('text=Hourly Transaction Velocity')).toBeVisible();
    await expect(page.locator("text=Today's Collections")).toBeVisible();
    await expect(page.locator('button:has-text("View Full")')).toBeVisible();

    // Click "View Full" to navigate to Collections sub-page
    await page.click('button:has-text("View Full")');
    await expect(page.locator('text=Collections & Settlements')).toBeVisible();
  });

  test('12. Arabic Language Switch & RTL Flow', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_HOME');

    // Language switch pill is visible on dashboard header
    const langPill = page.locator('button[title="التحويل إلى اللغة العربية"], button[aria-label="Switch language to Arabic"]');
    await expect(langPill).toBeVisible();

    // Click to switch to Arabic
    await langPill.click();

    // Verify document direction switched to RTL
    const htmlDir = await page.getAttribute('html', 'dir');
    expect(htmlDir).toBe('rtl');

    // Verify Arabic translations appear
    await expect(page.locator('text=تحصيلات اليوم')).toBeVisible();

    // Switch back to English
    const enPill = page.locator('button[title="Switch to English"], button[aria-label="Switch language to English"]');
    await expect(enPill).toBeVisible();
    await enPill.click();

    const restoredDir = await page.getAttribute('html', 'dir');
    expect(restoredDir).toBe('ltr');
    await expect(page.locator("text=Today's Collection")).toBeVisible();
  });
});
