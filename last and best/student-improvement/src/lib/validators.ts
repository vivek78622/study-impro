import { TASK_STATUS, TASK_PRIORITY, ASSIGNMENT_STATUS, STUDY_SESSION_MODE, STUDY_SESSION_STATUS } from '../constants'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateTaskStatus = (status: string): boolean => {
  return Object.values(TASK_STATUS).includes(status as any)
}

export const validateTaskPriority = (priority: string): boolean => {
  return Object.values(TASK_PRIORITY).includes(priority as any)
}

export const validateAssignmentStatus = (status: string): boolean => {
  return Object.values(ASSIGNMENT_STATUS).includes(status as any)
}

export const validateStudySessionMode = (mode: string): boolean => {
  return Object.values(STUDY_SESSION_MODE).includes(mode as any)
}

export const validateStudySessionStatus = (status: string): boolean => {
  return Object.values(STUDY_SESSION_STATUS).includes(status as any)
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateDate = (date: string): boolean => {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}