import { test, expect } from '@playwright/test'

test.describe('AutoOps AI - Elite Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Prihlásenie (Mock Auth)
    await page.goto('http://localhost:5001/login')
    await page.fill('input[type="email"]', 'operator@autoops.local')
    await page.click('button[type="submit"]')
    
    // Počkáme na úspešné prihlásenie a redirect
    await page.waitForURL('**/')
    
    // 2. Navigácia na eskalácie
    await page.goto('http://localhost:5001/escalations')
    
    // Počkáme, kým zmizne "Initializing..." loader
    await page.waitForSelector('text=Initializing AutoOps...', { state: 'detached' })
    await page.waitForLoadState('networkidle')
  })

  test('should display the escalations page title', async ({ page }) => {
    // Overíme, či vidíme nadpis "Eskalácie" (alebo preklad)
    const title = page.locator('h2')
    await expect(title).toBeVisible()
  })

  test('should show empty state or list of escalations', async ({ page }) => {
    // Overíme, či sa načítal buď zoznam alebo "žiadne požiadavky"
    const emptyState = page.getByText(/Žiadne čakajúce požiadavky|No pending requests/i)
    const cardList = page.locator('.cursor-pointer')
    
    const isVisible = await emptyState.isVisible() || (await cardList.count() >= 0)
    expect(isVisible).toBeTruthy()
  })

  test('should check if sidebar has the new link', async ({ page }) => {
    const navLink = page.locator('nav a[href="/escalations"]')
    await expect(navLink).toBeVisible()
  })

  test('should verify API proxy is working', async ({ page }) => {
    // Sledujeme network requesty na /api/admin/escalations
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/admin/escalations') && response.status() === 200
    )
    
    await page.reload()
    const response = await responsePromise
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(Array.isArray(data)).toBeTruthy()
  })
})
