import { test, expect } from '@playwright/test'

test.describe('Internationalization (i18n) Verification', () => {
  test('should switch between English and Slovak on the login page', async ({ page }) => {
    await page.goto('/login')
    
    // Switch to Slovak
    await page.getByRole('button', { name: /en/i }).first().click()
    await page.getByRole('menuitem', { name: /Slovenčina/i }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'sk')
    await expect(page.getByText(/Prihláste sa do/i)).toBeVisible()
    
    // Switch back to English
    await page.getByRole('button', { name: /sk/i }).first().click()
    await page.getByRole('menuitem', { name: /English/i }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByText(/Sign in to/i)).toBeVisible()
  })

  test('should maintain language preference after login', async ({ page }) => {
    await page.goto('/login')
    
    // Set to Slovak
    await page.getByRole('button', { name: /en/i }).first().click()
    await page.getByRole('menuitem', { name: /Slovenčina/i }).click()
    
    // Login
    await page.getByLabel(/E-mail/i).fill('test@autoops.ai')
    await page.getByRole('button', { name: /Pokračovať/i }).click()
    
    // Verify dashboard is in Slovak
    await expect(page).toHaveURL(/http:\/\/localhost:5180\/?/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'sk')
    
    // Check for text that is visible on both desktop and mobile
    await expect(page.getByText(/Operačný kokpit/i)).toBeVisible({ timeout: 10000 })
  })


})
