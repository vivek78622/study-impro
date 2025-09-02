"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToHabits, updateHabit } from '../../services/habits'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Target, Flame, ArrowRight } from 'lucide-react'

interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: string
  streak: number
  completedToday: boolean
  createdAt: any
  lastCompleted?: any
}

const HabitWidget = () => {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToHabits(user.uid, async (fetchedHabits) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const processedHabits = []
      const streakUpdates = []
      
      for (const h of fetchedHabits.slice(0, 3)) {
        const lastCompleted = h.lastCompleted?.toDate ? h.lastCompleted.toDate() : null
        const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null
        
        // Check if habit was completed today
        const completedToday = lastCompletedDate && lastCompletedDate.getTime() === today.getTime()
        
        // Reset streak if more than 1 day gap
        let currentStreak = h.streak || 0
        if (lastCompletedDate && !completedToday) {
          const daysDiff = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysDiff > 1) {
            currentStreak = 0
            // Queue streak update to Firebase
            if (currentStreak !== h.streak) {
              streakUpdates.push(updateHabit(h.id, { streak: currentStreak, completedToday: false }))
            }
          }
        }
        
        processedHabits.push({
          ...h,
          lastCompleted: lastCompleted,
          completedToday: completedToday || false,
          streak: currentStreak
        })
      }
      
      // Execute all streak updates
      if (streakUpdates.length > 0) {
        await Promise.all(streakUpdates)
      }
      
      setHabits(processedHabits)
      setLoading(false)
    })

    return unsubscribe
  }, [user?.uid])

  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null
    const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null
    
    const wasCompleted = habit.completedToday
    let newStreak = habit.streak
    
    if (!wasCompleted) {
      // Completing habit
      if (!lastCompletedDate || lastCompletedDate.getTime() === today.getTime() - 86400000) {
        // First completion or completed yesterday - continue streak
        newStreak = habit.streak + 1
      } else if (lastCompletedDate.getTime() < today.getTime() - 86400000) {
        // Missed days - reset streak
        newStreak = 1
      } else {
        // Same day completion
        newStreak = Math.max(1, habit.streak)
      }
    } else {
      // Uncompleting habit
      newStreak = Math.max(0, habit.streak - 1)
    }

    await updateHabit(habitId, {
      completedToday: !wasCompleted,
      streak: newStreak,
      lastCompleted: !wasCompleted ? now : null
    })
  }

  const completedToday = habits.filter(h => h.completedToday).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  if (loading) {
    return (
      <Card className="bg-white border-[#D2B48C]/30 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C1E1C1]" />
            Today's Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (habits.length === 0) {
    return (
      <Card className="bg-white border-[#D2B48C]/30 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C1E1C1]" />
            Today's Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">No habits yet</p>
          <Link href="/habits">
            <Button className="bg-[#C1E1C1] hover:bg-[#B5D6B5] text-gray-800">
              Create Your First Habit
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-[#D2B48C]/30 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C1E1C1]" />
            Today's Habits
          </CardTitle>
          <div className="text-sm text-gray-600">
            {completedToday}/{totalHabits} completed
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-[#C1E1C1] h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  habit.completedToday
                    ? 'bg-[#C1E1C1] border-[#C1E1C1] text-white'
                    : 'border-gray-300 hover:border-[#C1E1C1]'
                }`}
              >
                {habit.completedToday ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4 opacity-0" />
                )}
              </button>
              <div className="flex-1">
                <p className={`font-medium text-sm ${habit.completedToday ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {habit.category}
                  </span>
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[#FFCC99]">
                      <Flame className="w-3 h-3" />
                      {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Link href="/habits" className="block">
          <Button variant="outline" className="w-full mt-4 border-[#D2B48C] hover:bg-[#D2B48C]/10 text-gray-700">
            View All Habits
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default HabitWidget