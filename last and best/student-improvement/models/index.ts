// Compatible with both client and server Firebase SDKs
type Timestamp = any

export interface User {
  uid: string
  name: string
  email: string
  photoUrl: string | null
  role: 'user'
  createdAt: Timestamp
  lastSeenAt: Timestamp
  demo?: boolean
}

export interface Task {
  id?: string
  userId: string
  title: string
  description: string
  dueDate: Timestamp
  priority: 'low' | 'medium' | 'high'
  category: string
  status: 'todo' | 'in_progress' | 'done'
  progress: number
  createdAt: Timestamp
  demo?: boolean
}

export interface Assignment {
  id?: string
  userId: string
  title: string
  subject: string
  due: Timestamp
  status: 'not_started' | 'in_progress' | 'done'
  progress: number
  grade: string
  notes: string
  files: string[]
  demo?: boolean
}

export interface Habit {
  id?: string
  userId: string
  name: string
  description: string
  category: string
  frequency: string
  streak: number
  completedToday: boolean
  lastCompleted: Timestamp
  createdAt: Timestamp
  demo?: boolean
}

export interface Schedule {
  id?: string
  userId: string
  title: string
  date: Timestamp
  start: string
  end: string
  category: 'Classes' | 'Study' | 'Personal' | 'Exams' | 'Deadlines'
  location?: string
  notes?: string
  priority?: 'low' | 'medium' | 'high'
  reminder?: string
  demo?: boolean
}

export interface StudySession {
  id?: string
  userId: string
  mode: '25min' | '60min'
  startTime: Timestamp
  endTime?: Timestamp
  status: 'active' | 'completed' | 'paused'
  notes: string
  subject?: string
  breakDuration?: number
  focusScore?: number
  demo?: boolean
}

export interface Expense {
  id?: string
  userId: string
  date: Timestamp
  category: string
  amount: number
  note: string
  demo?: boolean
}

export interface Config {
  appId: string
  branding: {
    name: string
    primaryColor: string
    secondaryColor: string
    logo: string
  }
  defaults: {
    pomodoroLength: number
    breakLength: number
    dailyGoal: number
    theme: string
  }
  createdAt: Timestamp
}