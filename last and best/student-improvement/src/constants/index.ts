export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  ASSIGNMENTS: '/assignments',
  HABITS: '/habits',
  SCHEDULE: '/schedule',
  STUDY: '/study',
  BUDGET: '/budget',
  PROFILE: '/profile'
} as const

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
} as const

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export const ASSIGNMENT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
} as const

export const STUDY_SESSION_MODE = {
  POMODORO: '25min',
  EXTENDED: '60min'
} as const

export const STUDY_SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const

export const COLORS = {
  PRIMARY: '#C1E1C1',
  SECONDARY: '#ADD8E6',
  ACCENT: '#FFCC99',
  BACKGROUND: '#F5F0E1',
  BORDER: '#D2B48C',
  LAVENDER: '#E6E6FA'
} as const