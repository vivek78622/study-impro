"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Calendar, Flame, BookOpen } from "lucide-react"

interface QuickStatsProps {
  tasksDueToday: number
  nextEvent: string | null
  studyStreak: number
  pendingAssignments: number
}

export default function QuickStats({ tasksDueToday, nextEvent, studyStreak, pendingAssignments }: QuickStatsProps) {
  const stats = [
    {
      icon: CheckCircle2,
      value: tasksDueToday,
      label: "Tasks Due Today",
      color: "text-[#C1E1C1]",
      bg: "bg-[#C1E1C1]/10"
    },
    {
      icon: Calendar,
      value: nextEvent || "No events",
      label: "Next Event",
      color: "text-[#ADD8E6]",
      bg: "bg-[#ADD8E6]/10"
    },
    {
      icon: Flame,
      value: `${studyStreak} days`,
      label: "Study Streak",
      color: "text-[#FFCC99]",
      bg: "bg-[#FFCC99]/10"
    },
    {
      icon: BookOpen,
      value: pendingAssignments,
      label: "Pending Assignments",
      color: "text-[#E6E6FA]",
      bg: "bg-[#E6E6FA]/10"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-[#D2B48C]/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {typeof stat.value === 'string' && stat.value.length > 15 
                    ? `${stat.value.substring(0, 15)}...` 
                    : stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}