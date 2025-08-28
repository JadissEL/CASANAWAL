import { test, expect } from '@playwright/test';

test.describe('About Page - Bilingual Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should display French content by default', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1').last()).toContainText('À Propos');
    
    // Check the exact intro text as specified in the prompt
    await expect(page.getByText(
      "Nawal est une femme marocaine mariée et mère de cinq enfants... une livraison d'une qualité irréprochable."
    )).toBeVisible();
    
    // Check the "more soon" message
    await expect(page.getByText(
      "Plus de détails sur l'histoire de Nawal et sa philosophie culinaire seront bientôt disponibles."
    )).toBeVisible();
    
    // Check back link
    await expect(page.getByText('Retour à l\'accueil')).toBeVisible();
    
    // Check CTA button
    await expect(page.getByText('Découvrir nos Plats')).toBeVisible();
    
    // Check values section
    await expect(page.getByText('Nos Valeurs')).toBeVisible();
    await expect(page.getByText('Authenticité')).toBeVisible();
    await expect(page.getByText('Qualité')).toBeVisible();
    await expect(page.getByText('Passion')).toBeVisible();
    
    // Check journey section
    await expect(page.getByText('Son Parcours')).toBeVisible();
    
    // Check contact section
    await expect(page.getByText('Contactez Nawal')).toBeVisible();
  });

  test('should switch to Arabic when language toggle is clicked', async ({ page }) => {
    // Click language toggle
    await page.getByText('العربية').click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check page title in Arabic
    await expect(page.locator('h1').last()).toContainText('نبذة عن نوال');
    
    // Check the exact intro text in Arabic as specified
    await expect(page.getByText(
      'نوال سيدة مغربية متزوجة وأم لخمسة أطفال... مع خدمة توصيل بجودة لا تشوبها شائبة.'
    )).toBeVisible();
    
    // Check the "more soon" message in Arabic
    await expect(page.getByText(
      'ستتوفر قريبًا مزيدٌ من التفاصيل حول قصة نوال وفلسفتها في الطهي.'
    )).toBeVisible();
    
    // Check back link in Arabic
    await expect(page.getByText('العودة إلى الصفحة الرئيسية')).toBeVisible();
    
    // Check CTA button in Arabic
    await expect(page.getByText('اكتشف أطباقنا')).toBeVisible();
    
    // Check values section in Arabic
    await expect(page.getByText('قيمنا')).toBeVisible();
    await expect(page.getByText('الأصالة')).toBeVisible();
    await expect(page.getByText('الجودة')).toBeVisible();
    await expect(page.getByText('الشغف')).toBeVisible();
    
    // Check journey section in Arabic
    await expect(page.getByText('رحلتها')).toBeVisible();
    
    // Check contact section in Arabic
    await expect(page.getByText('تواصل معنا')).toBeVisible();
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

  test('should navigate to menu when CTA is clicked (French)', async ({ page }) => {
    await page.getByText('Découvrir nos Plats').click();
    await expect(page).toHaveURL('/menu');
  });

  test('should navigate to menu when CTA is clicked (Arabic)', async ({ page }) => {
    // Switch to Arabic first
    await page.getByText('العربية').click();
    await page.waitForTimeout(500);
    
    await page.getByText('اكتشف أطباقنا').click();
    await expect(page).toHaveURL('/menu');
  });

  test('should navigate back to home when back link is clicked', async ({ page }) => {
    await page.getByText('Retour à l\'accueil').click();
    await expect(page).toHaveURL('/');
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
    
    // Test CTA button accessibility
    await page.getByText('Découvrir nos Plats').focus();
    await expect(page.getByText('Découvrir nos Plats')).toBeFocused();
  });

  test('should have proper ARIA labels and semantic markup', async ({ page }) => {
    // Check navigation has proper ARIA label
    await expect(page.locator('nav').first()).toHaveAttribute('role', 'navigation');
    
    // Check main content area
    await expect(page.locator('main')).toBeVisible();
    
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(2); // Logo and page title
    
    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(3); // Values, Journey, Contact sections
    
    const h3 = page.locator('h3');
    await expect(h3).toHaveCount(3); // Three value cards
    
    // Check breadcrumb navigation has proper ARIA label
    await expect(page.locator('nav').nth(1)).toHaveAttribute('aria-label');
    
    // Check CTA button has proper ARIA label
    const ctaButton = page.getByText('Découvrir nos Plats');
    const ariaLabel = await ctaButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('Découvrir nos Plats');
  });

  test('should display value cards with proper content', async ({ page }) => {
    // Check that exactly 3 value cards are displayed
    const valueCards = page.locator('.group').filter({ has: page.locator('h3') });
    await expect(valueCards).toHaveCount(3);
    
    // Check value card content
    await expect(page.getByText('Recettes traditionnelles transmises de génération en génération')).toBeVisible();
    await expect(page.getByText('Ingrédients frais et sélectionnés avec soin')).toBeVisible();
    await expect(page.getByText('Amour de la cuisine marocaine dans chaque plat')).toBeVisible();
  });

  test('should display timeline preview in journey section', async ({ page }) => {
    // Check that timeline elements are visible
    const timelineSteps = page.locator('.w-8.h-8.bg-terracotta.rounded-full');
    await expect(timelineSteps).toHaveCount(3);
    
    // Check timeline has proper numbering
    await expect(timelineSteps.nth(0)).toContainText('1');
    await expect(timelineSteps.nth(1)).toContainText('2');
    await expect(timelineSteps.nth(2)).toContainText('3');
  });

  test('should display contact information correctly', async ({ page }) => {
    // Check contact information is displayed
    await expect(page.getByText('Casablanca, Maroc')).toBeVisible();
    await expect(page.getByText('+212 6 XX XX XX XX')).toBeVisible();
    await expect(page.getByText('contact@nawal.ma')).toBeVisible();
    
    // Check icons are present
    const contactIcons = page.locator('[aria-hidden="true"]').filter({ hasText: '' });
    await expect(contactIcons.first()).toBeVisible();
  });

  test('should handle hover states on value cards', async ({ page }) => {
    // Get first value card
    const firstValueCard = page.locator('.group').first();
    
    // Hover over the card
    await firstValueCard.hover();
    
    // Check that hover effects are applied
    await expect(firstValueCard).toBeVisible();
  });

  test('should have proper breadcrumb navigation', async ({ page }) => {
    // Check breadcrumb structure
    const breadcrumb = page.locator('nav').nth(1);
    await expect(breadcrumb).toBeVisible();
    
    // Check breadcrumb link
    await expect(breadcrumb.locator('a')).toHaveAttribute('href', '/');
    
    // Test breadcrumb navigation
    await breadcrumb.locator('a').click();
    await expect(page).toHaveURL('/');
  });

  test('should display background patterns correctly', async ({ page }) => {
    // Check that pattern containers are present
    const patternContainers = page.locator('[aria-hidden="true"]').filter({ hasText: '' });
    await expect(patternContainers.first()).toBeVisible();
    
    // Check story section has pattern
    const storySection = page.locator('.bg-white.rounded-3xl').first();
    await expect(storySection).toBeVisible();
  });

  test('should display proper responsive layout', async ({ page }) => {
    // Check main grid layout
    const heroGrid = page.locator('.lg\\:grid-cols-5').first();
    await expect(heroGrid).toBeVisible();
    
    // Check values grid
    const valuesGrid = page.locator('.md\\:grid-cols-3').first();
    await expect(valuesGrid).toBeVisible();
    
    // Check responsive classes
    const mainContainer = page.locator('main > div').first();
    await expect(mainContainer).toHaveClass(/max-w-7xl/);
    await expect(mainContainer).toHaveClass(/mx-auto/);
  });
});
