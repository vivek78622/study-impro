"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { subscribeToTasks } from '../services/tasks'
import { subscribeToAssignments } from '../services/assignments'
import { subscribeToHabits } from '../services/habits'
import { subscribeToScheduleEvents } from '../services/schedule'
import { subscribeToStudySessions } from '../services/studySessions'
import { subscribeToExpenses } from '../services/expenses'
import { Task, Assignment, Habit, Schedule, StudySession, Expense } from '../../models'

interface DashboardData {
  tasks: Task[]
  assignments: Assignment[]
  habits: Habit[]
  schedule: Schedule[]
  studySessions: StudySession[]
  expenses: Expense[]
  loading: boolean
}

const DashboardContext = createContext<DashboardData>({
  tasks: [],
  assignments: [],
  habits: [],
  schedule: [],
  studySessions: [],
  expenses: [],
  loading: true
})

export const useDashboard = () => useContext(DashboardContext)

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    tasks: [],
    assignments: [],
    habits: [],
    schedule: [],
    studySessions: [],
    expenses: [],
    loading: true
  })

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribes: (() => void)[] = []

    // Subscribe to all collections
    unsubscribes.push(
      subscribeToTasks(user.uid, (tasks) => 
        setData(prev => ({ ...prev, tasks, loading: false }))
      )
    )

    unsubscribes.push(
      subscribeToAssignments(user.uid, (assignments) => 
        setData(prev => ({ ...prev, assignments }))
      )
    )

    unsubscribes.push(
      subscribeToHabits(user.uid, (habits) => 
        setData(prev => ({ ...prev, habits }))
      )
    )

    unsubscribes.push(
      subscribeToScheduleEvents(user.uid, (schedule) => 
        setData(prev => ({ ...prev, schedule }))
      )
    )

    unsubscribes.push(
      subscribeToStudySessions(user.uid, (studySessions) => 
        setData(prev => ({ ...prev, studySessions }))
      )
    )

    unsubscribes.push(
      subscribeToExpenses(user.uid, (expenses) => 
        setData(prev => ({ ...prev, expenses }))
      )
    )

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
  }, [user?.uid])

  return (
    <DashboardContext.Provider value={data}>
      {children}
    </DashboardContext.Provider>
  )
}