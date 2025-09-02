# Testing Guide

## Overview

This project uses a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Firebase Emulators
- **E2E Tests**: Playwright
- **Security Tests**: Firestore Rules Testing

## Test Structure

```
__tests__/
├── components/          # Component unit tests
├── services/           # Service integration tests
├── mocks/             # Mock implementations
├── utils/             # Test utilities
└── firestore.rules.test.ts  # Security rules tests

e2e/
├── auth-flow.spec.ts   # Authentication E2E tests
├── tasks-crud.spec.ts  # Tasks CRUD E2E tests
└── schedule-events.spec.ts  # Schedule E2E tests
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Integration Tests with Emulators

```bash
# Start Firebase emulators
npm run emulators

# Run tests against emulators (in another terminal)
npm run emulators:test
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test auth-flow.spec.ts
```

### Firestore Security Rules Tests

```bash
# Test security rules
npm run test:rules
```

## Writing Tests

### Unit Test Example

```typescript
// __tests__/components/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '@/components/TaskCard'
import { mockTask } from '../utils/test-utils'

describe('TaskCard', () => {
  it('renders task information', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
    expect(screen.getByText(mockTask.description)).toBeInTheDocument()
  })

  it('calls onStatusChange when status is updated', () => {
    const onStatusChange = jest.fn()
    render(<TaskCard task={mockTask} onStatusChange={onStatusChange} />)
    
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }))
    
    expect(onStatusChange).toHaveBeenCalledWith(mockTask.id, 'done')
  })
})
```

### Service Test Example

```typescript
// __tests__/services/tasks.test.ts
import { createTask } from '@/services/tasks'
import { addDoc } from 'firebase/firestore'

jest.mock('firebase/firestore')

describe('Tasks Service', () => {
  it('creates task with correct data', async () => {
    const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>
    mockAddDoc.mockResolvedValue({ id: 'new-task-id' } as any)

    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      // ... other fields
    }

    await createTask('user-123', taskData)

    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...taskData,
        userId: 'user-123',
        createdAt: expect.anything()
      })
    )
  })
})
```

### E2E Test Example

```typescript
// e2e/tasks-crud.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tasks CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.goto('/tasks')
  })

  test('should create new task', async ({ page }) => {
    await page.click('[data-testid="add-task-btn"]')
    await page.fill('input[name="title"]', 'E2E Test Task')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=E2E Test Task')).toBeVisible()
  })
})
```

## Test Data Management

### Mock Data

Use consistent mock data from `__tests__/utils/test-utils.tsx`:

```typescript
import { mockTask, mockUser, mockScheduleEvent } from '../utils/test-utils'

// Use in tests
render(<TaskCard task={mockTask} />)
```

### Firebase Mocks

Firebase services are mocked in `__tests__/mocks/firebase.ts`:

```typescript
// Automatically mocked in jest.setup.js
import { mockFirestore, mockAuth } from '../mocks/firebase'
```

### Test Environment

Tests run with environment variables from `.env.test`:

```bash
NODE_ENV=test
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

## Coverage Requirements

Minimum coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## CI/CD Testing

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Scheduled runs (nightly)

### Test Matrix

Tests run on:
- Node.js 18.x and 20.x
- Multiple browsers (Chromium, Firefox, WebKit)
- Desktop and mobile viewports

## Debugging Tests

### Unit Tests

```bash
# Debug specific test
npm run test -- --testNamePattern="TaskCard"

# Run tests with verbose output
npm run test -- --verbose

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests

```bash
# Run tests in headed mode
npx playwright test --headed

# Debug specific test
npx playwright test --debug auth-flow.spec.ts

# Generate test report
npx playwright show-report
```

### Emulator Debugging

```bash
# Start emulators with debug logging
firebase emulators:start --debug

# View emulator UI
open http://localhost:4000
```

## Best Practices

### Unit Tests

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests focused and isolated**
4. **Mock external dependencies**
5. **Test edge cases and error conditions**

### E2E Tests

1. **Test critical user journeys**
2. **Use data-testid attributes for selectors**
3. **Keep tests independent**
4. **Use page object pattern for complex flows**
5. **Test on multiple browsers and devices**

### Test Maintenance

1. **Update tests when features change**
2. **Remove obsolete tests**
3. **Keep test data current**
4. **Monitor test performance**
5. **Review test coverage regularly**

## Troubleshooting

### Common Issues

**Tests timing out:**
- Increase timeout values
- Check for async operations
- Ensure proper cleanup

**Flaky tests:**
- Add proper waits
- Check for race conditions
- Use deterministic test data

**Mock issues:**
- Verify mock implementations
- Check mock reset between tests
- Ensure proper module mocking

### Getting Help

- Check test logs for error details
- Use debugger to step through tests
- Review similar working tests
- Ask team for code review

---

**Happy testing! 🧪**