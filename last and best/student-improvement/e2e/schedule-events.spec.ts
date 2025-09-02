import { test, expect } from '@playwright/test'

test.describe('Schedule Events', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to schedule
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    await page.click('text=Schedule')
    await expect(page).toHaveURL('/schedule')
  })

  test('should create a new schedule event', async ({ page }) => {
    // Click add event button
    await page.click('[data-testid="add-event-btn"]')
    
    // Fill event form
    await page.fill('input[name="title"]', 'E2E Test Event')
    await page.fill('input[name="location"]', 'Test Location')
    await page.fill('textarea[name="notes"]', 'Test event notes')
    
    // Set date and time
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.fill('input[name="date"]', tomorrow.toISOString().split('T')[0])
    await page.fill('input[name="start"]', '10:00')
    await page.fill('input[name="end"]', '11:00')
    
    // Set category and priority
    await page.selectOption('select[name="category"]', 'study')
    await page.selectOption('select[name="priority"]', 'medium')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify event appears in calendar
    await expect(page.locator('text=E2E Test Event')).toBeVisible()
  })

  test('should view event details', async ({ page }) => {
    // Click on first event
    const firstEvent = page.locator('[data-testid="calendar-event"]').first()
    await firstEvent.click()
    
    // Verify event details modal opens
    await expect(page.locator('[data-testid="event-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="event-title"]')).toBeVisible()
  })

  test('should navigate between months', async ({ page }) => {
    // Get current month
    const currentMonth = await page.locator('[data-testid="current-month"]').textContent()
    
    // Navigate to next month
    await page.click('[data-testid="next-month-btn"]')
    
    // Verify month changed
    const newMonth = await page.locator('[data-testid="current-month"]').textContent()
    expect(newMonth).not.toBe(currentMonth)
    
    // Navigate back
    await page.click('[data-testid="prev-month-btn"]')
    
    // Verify back to original month
    await expect(page.locator('[data-testid="current-month"]')).toHaveText(currentMonth!)
  })
})