import { Timestamp } from 'firebase/firestore'

export type ScheduleCategory = 'class' | 'study' | 'exam' | 'meeting' | 'personal' | 'other'
export type SchedulePriority = 'low' | 'medium' | 'high'
export type ScheduleReminder = 'none' | '5m' | '15m' | '30m' | '1h'

export interface ScheduleEvent {
  id?: string
  userId: string
  title: string
  date: Timestamp
  start: string // "HH:mm"
  end: string // "HH:mm"
  category: ScheduleCategory
  notes?: string
  priority: SchedulePriority
  reminder: ScheduleReminder
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CreateScheduleEvent {
  title: string
  date: Date
  start: string
  end: string
  category: ScheduleCategory
  notes?: string
  priority: SchedulePriority
  reminder: ScheduleReminder
}