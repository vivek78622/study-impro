"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeToTasks } from '../services/tasks'
import { subscribeToScheduleEvents } from '../services/schedule'
import { subscribeToStudySessions } from '../services/studySessions'
import { subscribeToHabits, updateHabit } from '../services/habits'
import { subscribeToAssignments } from '../services/assignments'
import { subscribeToExpenses } from '../services/expenses'

export function useDashboardData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    tasks: [],
    schedule: [],
    studySessions: [],
    habits: [],
    assignments: [],
    expenses: []
  })

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribes: (() => void)[] = []
    let loadedCount = 0
    const totalSubscriptions = 6

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === totalSubscriptions) {
        setLoading(false)
      }
    }

    // Subscribe to tasks
    unsubscribes.push(
      subscribeToTasks(user.uid, (tasks) => {
        setData(prev => ({ ...prev, tasks }))
        checkAllLoaded()
      })
    )

    // Subscribe to schedule
    unsubscribes.push(
      subscribeToScheduleEvents(user.uid, (schedule) => {
        setData(prev => ({ ...prev, schedule }))
        checkAllLoaded()
      })
    )

    // Subscribe to study sessions
    unsubscribes.push(
      subscribeToStudySessions(user.uid, (studySessions) => {
        setData(prev => ({ ...prev, studySessions }))
        checkAllLoaded()
      })
    )

    // Subscribe to habits
    unsubscribes.push(
      subscribeToHabits(user.uid, (habits) => {
        setData(prev => ({ ...prev, habits }))
        checkAllLoaded()
      })
    )

    // Subscribe to assignments
    unsubscribes.push(
      subscribeToAssignments(user.uid, (assignments) => {
        setData(prev => ({ ...prev, assignments }))
        checkAllLoaded()
      })
    )

    // Subscribe to expenses
    unsubscribes.push(
      subscribeToExpenses(user.uid, (expenses) => {
        setData(prev => ({ ...prev, expenses }))
        checkAllLoaded()
      })
    )

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
  }, [user?.uid])

  const toggleHabit = async (habitId: string) => {
    const habit = data.habits.find(h => h.id === habitId)
    if (!habit) return

    const wasCompleted = habit.completedToday
    const newStreak = wasCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1

    await updateHabit(habitId, {
      completedToday: !wasCompleted,
      streak: newStreak,
      lastCompleted: !wasCompleted ? new Date() : null
    })
  }

  return {
    ...data,
    loading,
    toggleHabit
  }
}