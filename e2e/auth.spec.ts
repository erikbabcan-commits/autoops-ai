import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/AutoOps AI/)
    await expect(page.getByRole('button', { name: /Continue with magic link/i })).toBeVisible()
  })

  test('should show mock session on login with test account', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/Email/i).fill('test@autoops.ai')
    await page.getByRole('button', { name: /Continue with magic link/i }).click()
    
    // Should redirect to dashboard in mock mode
    await expect(page).toHaveURL(/http:\/\/localhost:5180\/?/)
    await expect(page.getByText(/Orders processed/i)).toBeVisible({ timeout: 10000 })
  })
})
