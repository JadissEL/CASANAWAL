import { test, expect } from '@playwright/test';

test.describe('Offers Page - Bilingual Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/offers');
  });

  test('should display French content by default', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Offres Spéciales');
    
    // Check subtitle
    await expect(page.getByText('Découvrez nos promotions exclusives')).toBeVisible();
    
    // Check back link
    await expect(page.getByText('Retour à l\'accueil')).toBeVisible();
    
    // Check current offers section
    await expect(page.getByText('Offres Actuelles')).toBeVisible();
    
    // Check offer cards
    await expect(page.getByText('Festin Familial')).toBeVisible();
    await expect(page.getByText('Spécial Week-end')).toBeVisible();
    await expect(page.getByText('Bienvenue Nouveaux Clients')).toBeVisible();
    
    // Check pricing display
    await expect(page.getByText('199 MAD')).toBeVisible();
    await expect(page.getByText('280 MAD')).toBeVisible();
    
    // Check order buttons
    const orderButtons = page.getByText('Commander Maintenant');
    await expect(orderButtons).toHaveCount(3);
    
    // Check newsletter section
    await expect(page.getByText('Nouvelles Offres Bientôt')).toBeVisible();
    await expect(page.getByPlaceholder('Votre email')).toBeVisible();
  });

  test('should switch to Arabic when language toggle is clicked', async ({ page }) => {
    // Click language toggle
    await page.getByText('العربية').click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check page title in Arabic
    await expect(page.locator('h1')).toContainText('العروض الخاصة');
    
    // Check subtitle in Arabic
    await expect(page.getByText('اكتشف عروضنا الحصرية')).toBeVisible();
    
    // Check back link in Arabic
    await expect(page.getByText('العودة إلى الصفحة الرئيسية')).toBeVisible();
    
    // Check current offers section in Arabic
    await expect(page.getByText('العروض الحالية')).toBeVisible();
    
    // Check offer cards in Arabic
    await expect(page.getByText('وليمة العائلة')).toBeVisible();
    await expect(page.getByText('عرض نهاية الأسبوع')).toBeVisible();
    await expect(page.getByText('ترحيب بالعملاء الجدد')).toBeVisible();
    
    // Check order buttons in Arabic
    const orderButtons = page.getByText('اطلب الآن');
    await expect(orderButtons).toHaveCount(3);
    
    // Check newsletter section in Arabic
    await expect(page.getByText('عروض جديدة قريباً')).toBeVisible();
    await expect(page.getByPlaceholder('أدخل بريدك الإلكتروني')).toBeVisible();
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

  test('should display discount badges and pricing correctly', async ({ page }) => {
    // Check discount badges are visible
    await expect(page.getByText('-30%')).toBeVisible();
    await expect(page.getByText('-20%')).toBeVisible();
    await expect(page.getByText('-35%')).toBeVisible();
    
    // Check original and offer prices
    await expect(page.getByText('199 MAD').first()).toBeVisible();
    await expect(page.getByText('280 MAD').first()).toBeVisible();
    
    // Check validity dates
    await expect(page.getByText('2024-02-15')).toBeVisible();
    await expect(page.getByText('2024-02-11')).toBeVisible();
    await expect(page.getByText('2024-02-29')).toBeVisible();
  });

  test('should have accessible navigation and focus states', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Should focus on logo/home link
    await expect(page.locator('a[href="/"]')).toBeFocused();
    
    // Continue tabbing through interactive elements
    await page.keyboard.press('Tab'); // Language toggle
    await page.keyboard.press('Tab'); // Login button
    await page.keyboard.press('Tab'); // Cart button
    
    // Test back link accessibility
    await page.locator('a[href="/"]').nth(1).focus(); // Back link
    await expect(page.locator('a[href="/"]').nth(1)).toBeFocused();
    
    // Test order button accessibility
    const firstOrderButton = page.getByText('Commander Maintenant').first();
    await firstOrderButton.focus();
    await expect(firstOrderButton).toBeFocused();
  });

  test('should handle newsletter signup form', async ({ page }) => {
    // Focus email input
    const emailInput = page.getByPlaceholder('Votre email');
    await emailInput.click();
    await expect(emailInput).toBeFocused();
    
    // Type email
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    // Check subscribe button is clickable
    const subscribeButton = page.getByText('S\'abonner');
    await expect(subscribeButton).toBeVisible();
    await expect(subscribeButton).toBeEnabled();
  });

  test('should display offer features and badges correctly', async ({ page }) => {
    // Check offer badges
    await expect(page.getByText('Plus Populaire')).toBeVisible();
    await expect(page.getByText('Temps Limité')).toBeVisible();
    await expect(page.getByText('Nouveaux')).toBeVisible();
    
    // Check offer features with star icons
    await expect(page.getByText('Pour 4-6 personnes')).toBeVisible();
    await expect(page.getByText('Livraison gratuite')).toBeVisible();
    await expect(page.getByText('Ingrédients frais')).toBeVisible();
    
    // Check that star icons are present (accessibility)
    const starIcons = page.locator('[aria-hidden="true"]').filter({ hasText: '' });
    await expect(starIcons.first()).toBeVisible();
  });

  test('should navigate back to home when back link is clicked', async ({ page }) => {
    await page.getByText('Retour à l\'accueil').click();
    await expect(page).toHaveURL('/');
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
    await expect(h2).toHaveCount(1); // Current offers section
    
    const h3 = page.locator('h3');
    await expect(h3).toHaveCount(4); // 3 offer titles + newsletter title
    
    // Check order buttons have proper ARIA labels
    const orderButtons = page.getByText('Commander Maintenant');
    const firstOrderButton = orderButtons.first();
    const ariaLabel = await firstOrderButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('Commander Maintenant');
  });

  test('should handle hover states on offer cards', async ({ page }) => {
    // Get first offer card
    const firstOfferCard = page.locator('.group').first();
    
    // Hover over the card
    await firstOfferCard.hover();
    
    // Check that hover effects are applied (this would be visual in real testing)
    await expect(firstOfferCard).toBeVisible();
  });

  test('should display proper number of offers', async ({ page }) => {
    // Check that exactly 3 offers are displayed
    const offerCards = page.locator('.group').filter({ has: page.getByText('Commander Maintenant') });
    await expect(offerCards).toHaveCount(3);
    
    // Check offer counter
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('offres actives')).toBeVisible();
  });

  test('should have proper responsive design elements', async ({ page }) => {
    // Check that responsive classes are applied
    const mainContainer = page.locator('main > div').first();
    await expect(mainContainer).toHaveClass(/max-w-7xl/);
    await expect(mainContainer).toHaveClass(/mx-auto/);
    
    // Check grid layout for offers
    const offersGrid = page.locator('.grid').filter({ has: page.getByText('Commander Maintenant') });
    await expect(offersGrid).toHaveClass(/md:grid-cols-2/);
    await expect(offersGrid).toHaveClass(/lg:grid-cols-3/);
  });
});
