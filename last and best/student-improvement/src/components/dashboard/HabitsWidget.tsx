"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle2, Circle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Habit {
  id: string
  name: string
  completedToday: boolean
  streak: number
}

interface HabitsWidgetProps {
  habits: Habit[]
  loading: boolean
  onToggleHabit: (habitId: string) => void
}

export default function HabitsWidget({ habits, loading, onToggleHabit }: HabitsWidgetProps) {
  const completedToday = habits.filter(h => h.completedToday).length
  const recentHabits = habits.slice(0, 3)

  if (loading) {
    return (
      <Card className="border-[#D2B48C]/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#D2B48C]/20 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#E6E6FA]" />
            Habits
          </CardTitle>
          <Link href="/habits">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600">{completedToday}/{habits.length} completed today</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentHabits.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">No habits yet</p>
            <Link href="/habits">
              <Button size="sm" className="bg-[#E6E6FA] hover:bg-[#E6E6FA]/90 text-gray-800">
                Create Habit
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {recentHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <button
                  onClick={() => onToggleHabit(habit.id)}
                  className="flex-shrink-0"
                >
                  {habit.completedToday ? (
                    <CheckCircle2 className="w-5 h-5 text-[#E6E6FA]" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-[#E6E6FA]" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    habit.completedToday ? 'text-gray-600' : 'text-gray-800'
                  }`}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-[#E6E6FA]/50 text-[#E6E6FA]">
                      {habit.streak} day streak
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/habits">
              <Button variant="outline" size="sm" className="w-full mt-3 border-[#D2B48C]/40">
                View All Habits
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}