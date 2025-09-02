import { test, expect } from '@playwright/test'

test.describe('Tasks CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Navigate to tasks
    await page.click('text=Tasks')
    await expect(page).toHaveURL('/tasks')
  })

  test('should create a new task', async ({ page }) => {
    // Click add task button
    await page.click('[data-testid="add-task-btn"]')
    
    // Fill task form
    await page.fill('input[name="title"]', 'E2E Test Task')
    await page.fill('textarea[name="description"]', 'This is a test task created by E2E test')
    await page.selectOption('select[name="priority"]', 'high')
    await page.selectOption('select[name="category"]', 'study')
    
    // Set due date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.fill('input[name="dueDate"]', tomorrow.toISOString().split('T')[0])
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify task appears in list
    await expect(page.locator('text=E2E Test Task')).toBeVisible()
  })

  test('should update task status', async ({ page }) => {
    // Find first task and mark as in progress
    const firstTask = page.locator('[data-testid="task-item"]').first()
    await firstTask.locator('[data-testid="status-select"]').selectOption('in_progress')
    
    // Verify status updated
    await expect(firstTask.locator('[data-testid="status-badge"]')).toContainText('In Progress')
  })

  test('should delete a task', async ({ page }) => {
    // Get initial task count
    const initialCount = await page.locator('[data-testid="task-item"]').count()
    
    // Delete first task
    const firstTask = page.locator('[data-testid="task-item"]').first()
    await firstTask.locator('[data-testid="delete-task-btn"]').click()
    
    // Confirm deletion
    await page.click('button:has-text("Delete")')
    
    // Verify task count decreased
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(initialCount - 1)
  })

  test('should filter tasks by status', async ({ page }) => {
    // Filter by completed tasks
    await page.selectOption('[data-testid="status-filter"]', 'done')
    
    // Verify only completed tasks are shown
    const visibleTasks = page.locator('[data-testid="task-item"]')
    const count = await visibleTasks.count()
    
    for (let i = 0; i < count; i++) {
      await expect(visibleTasks.nth(i).locator('[data-testid="status-badge"]')).toContainText('Done')
    }
  })
})