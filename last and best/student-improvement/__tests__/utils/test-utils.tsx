import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock user for testing
export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
}

// Mock auth context value
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithGoogle: jest.fn(),
  logout: jest.fn(),
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data
export const mockTask = {
  id: 'task-1',
  userId: 'test-user-id',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: new Date('2024-12-31'),
  priority: 'medium' as const,
  category: 'study',
  status: 'todo' as const,
  progress: 0,
  createdAt: new Date(),
}

export const mockScheduleEvent = {
  id: 'event-1',
  userId: 'test-user-id',
  title: 'Test Event',
  date: new Date('2024-12-25'),
  start: '10:00',
  end: '11:00',
  category: 'study',
  location: 'Library',
  notes: 'Test notes',
  priority: 'medium' as const,
  reminder: '15min',
}

export const mockHabit = {
  id: 'habit-1',
  userId: 'test-user-id',
  name: 'Test Habit',
  description: 'Test habit description',
  category: 'health',
  frequency: 'daily',
  streak: 5,
  completedToday: false,
  lastCompleted: new Date(),
  createdAt: new Date(),
}

// Helper functions for testing
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const createMockFirestoreDoc = (data: any) => ({
  id: 'mock-id',
  data: () => data,
  exists: () => true,
})

export const createMockFirestoreSnapshot = (docs: any[]) => ({
  docs: docs.map(createMockFirestoreDoc),
  empty: docs.length === 0,
  size: docs.length,
})