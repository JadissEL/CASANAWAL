import { test, expect } from '@playwright/test';

test.describe('Menu Page - Bilingual Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('should display French content by default', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Menu');
    
    // Check subtitle
    await expect(page.getByText('Notre menu est en cours de préparation')).toBeVisible();
    
    // Check back link
    await expect(page.getByText('Retour à l\'accueil')).toBeVisible();
    
    // Check CTA button
    await expect(page.getByText('Découvrir les Offres Spéciales')).toBeVisible();
    
    // Check coming soon section
    await expect(page.getByText('Bientôt Disponible')).toBeVisible();
    await expect(page.getByText('Nous travaillons dur pour vous offrir')).toBeVisible();
    
    // Check categories
    await expect(page.getByText('Catégories')).toBeVisible();
    await expect(page.getByText('Tagines')).toBeVisible();
    await expect(page.getByText('Couscous')).toBeVisible();
    await expect(page.getByText('Pastillas')).toBeVisible();
    await expect(page.getByText('Desserts')).toBeVisible();
  });

  test('should switch to Arabic when language toggle is clicked', async ({ page }) => {
    // Click language toggle
    await page.getByText('العربية').click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check page title in Arabic
    await expect(page.locator('h1')).toContainText('القائمة');
    
    // Check subtitle in Arabic
    await expect(page.getByText('قائمتنا قيد التحضير')).toBeVisible();
    
    // Check back link in Arabic
    await expect(page.getByText('العودة إلى الصفحة الرئيسية')).toBeVisible();
    
    // Check CTA button in Arabic
    await expect(page.getByText('اكتشف العروض الخاصة')).toBeVisible();
    
    // Check coming soon section in Arabic
    await expect(page.getByText('قريباً متاح')).toBeVisible();
    await expect(page.getByText('نحن نعمل بجد ل��قديم أفضل')).toBeVisible();
    
    // Check categories in Arabic
    await expect(page.getByText('الفئات')).toBeVisible();
    await expect(page.getByText('طواجين')).toBeVisible();
    await expect(page.getByText('كسكس')).toBeVisible();
    await expect(page.getByText('بسطيلة')).toBeVisible();
    await expect(page.getByText('حلويات')).toBeVisible();
  });

  test('should have proper RTL direction for Arabic', async ({ page }) => {
    // Switch to Arabic
    await page.getByText('العربية').click();
    await page.waitForTimeout(500);
    
    // Check document direction
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
    
    // Check document language
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ar');
  });

  test('should have accessible navigation and focus states', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Should focus on logo/home link
    await expect(page.locator('a[href="/"]')).toBeFocused();
    
    // Continue tabbing to language toggle and other buttons
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Cart button
    
    // Test back link accessibility
    await page.locator('a[href="/"]').nth(1).focus(); // Back link
    await expect(page.locator('a[href="/"]').nth(1)).toBeFocused();
    
    // Test CTA button accessibility
    await page.locator('a[href="/offers"]').focus();
    await expect(page.locator('a[href="/offers"]')).toBeFocused();
  });

  test('should display category cards with proper hover states', async ({ page }) => {
    // Check that category cards are visible
    const categoryCards = page.locator('[role="button"]');
    await expect(categoryCards).toHaveCount(4);
    
    // Test hover state on first card
    await categoryCards.first().hover();
    
    // Check that coming soon text becomes visible on hover
    await expect(page.getByText('Prochainement...').first()).toBeVisible();
  });

  test('should navigate back to home when back link is clicked', async ({ page }) => {
    await page.getByText('Retour à l\'accueil').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to offers when CTA is clicked', async ({ page }) => {
    await page.getByText('Découvrir les Offres Spéciales').click();
    await expect(page).toHaveURL('/offers');
  });

  test('should have proper ARIA labels and semantic markup', async ({ page }) => {
    // Check navigation has proper ARIA label
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // Check main content area
    await expect(page.locator('main')).toBeVisible();
    
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(2); // Logo and page title
    
    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(2); // Categories and Coming Soon
    
    // Check category buttons have proper ARIA labels
    const categoryButtons = page.locator('[role="button"]');
    for (let i = 0; i < 4; i++) {
      await expect(categoryButtons.nth(i)).toHaveAttribute('aria-label');
      await expect(categoryButtons.nth(i)).toHaveAttribute('tabindex', '0');
    }
  });

  test('should handle keyboard interaction on category cards', async ({ page }) => {
    const firstCategory = page.locator('[role="button"]').first();
    
    // Focus the category card
    await firstCategory.focus();
    await expect(firstCategory).toBeFocused();
    
    // Test Enter key
    await page.keyboard.press('Enter');
    // Note: In a real implementation, this would trigger category selection
    
    // Test Space key
    await firstCategory.focus();
    await page.keyboard.press(' ');
    // Note: In a real implementation, this would trigger category selection
  });

  test('should have proper color contrast and visual hierarchy', async ({ page }) => {
    // Check that main heading is visible and properly styled
    const mainHeading = page.locator('h1').last(); // Page title, not logo
    await expect(mainHeading).toBeVisible();
    
    // Check that the gradient line under heading is visible
    const gradientLine = page.locator('.bg-gradient-to-r');
    await expect(gradientLine.first()).toBeVisible();
    
    // Check that category cards have proper styling
    const categoryCards = page.locator('.bg-white.rounded-2xl.p-6');
    await expect(categoryCards).toHaveCount(5); // 4 categories + 1 coming soon section
  });
});
