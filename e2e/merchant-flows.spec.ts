import { test, expect } from '@playwright/test';

test.describe('Saudi Merchant App Flow QA', () => {
  test('1. Splash and Onboarding Flow', async ({ page }) => {
    await page.goto('/?screen=SPLASH');
    await expect(page.locator('text=QUICK | TRUSTED | PAYMENTS')).toBeVisible();
    await expect(page.locator('text=powered by')).toBeVisible();
  });

  test('2. Merchant Dashboard, SettleNow, and Working Capital', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_HOME');
    await expect(page.locator('text=Starmart Supermarket')).toBeVisible();
    await expect(page.locator('text=SettleNow — Instant Sarie Transfer')).toBeVisible();
    await expect(page.locator('text=Merchant Growth Financing')).toBeVisible();
    await expect(page.locator('span:has-text("SAR 50,000")').first()).toBeVisible();

    // Trigger SettleNow
    const settleBtn = page.locator('button:has-text("Settle Now")').first();
    await expect(settleBtn).toBeVisible();
    await settleBtn.click();
    await expect(page.locator('text=Instant payout of SAR')).toBeVisible();
  });

  test('3. Dual-Tab Collections and Settlements Ledger', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_COLLECTIONS');
    await expect(page.locator('text=Collections & Settlements')).toBeVisible();
    await expect(page.locator('button:has-text("Transactions")')).toBeVisible();
    await expect(page.locator('button:has-text("Settlements")')).toBeVisible();

    // Switch to Settlements Tab
    await page.click('button:has-text("Settlements")');
    await expect(page.locator('text=Sarie Settlement History')).toBeVisible();
    await expect(page.locator('text=Sarie UTR').first()).toBeVisible();
    await expect(page.locator('button:has-text("Download VAT Invoice")').first()).toBeVisible();

    // Trigger VAT Invoice Download feedback
    await page.locator('button:has-text("Download VAT Invoice")').first().click();
    await expect(page.locator('text=Downloading ZATCA VAT Tax Invoice')).toBeVisible();
  });

  test('4. My Store QR Stand Hub (Static and Dynamic)', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_QR_GENERATOR');
    await expect(page.locator('text=My Store QR Hub')).toBeVisible();
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
    await expect(page.locator('text=mada Debit')).toBeVisible();
    await expect(page.locator('button:has-text("Charge")').first()).toBeVisible();

    await page.click('button:has-text("Charge")');
    await expect(page.locator('text=Hold Card or Phone to Back of Device')).toBeVisible();
  });

  test('6. Smart SoundBox Notifier', async ({ page }) => {
    await page.goto('/?screen=SOUNDBOX_NOTIFIER');
    await expect(page.locator('text=QTPay Smart SoundBox')).toBeVisible();
    await expect(page.locator('text=Voice Announcement Language')).toBeVisible();
    await expect(page.locator('text=Quick Audio Triggers')).toBeVisible();
  });
});
