import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should complete login to dashboard flow', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/')
    
    // Check landing page loads
    await expect(page).toHaveTitle(/Student Improvement/)
    
    // Navigate to login
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
    
    // Fill login form (using demo credentials)
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    
    // Submit login
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should handle login errors', async ({ page }) => {
    await page.goto('/login')
    
    // Try invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Logout')
    
    // Should redirect to landing
    await expect(page).toHaveURL('/')
  })
})