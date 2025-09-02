"use client"

import Link from "next/link"
import { useStore } from "@/hooks/useStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Calendar, Target, DollarSign, BookOpen, Clock } from "lucide-react"

export function LiveNavigation() {
  const { data } = useStore()
  
  const pendingTasks = data.tasks.filter(t => !t.completed).length
  const todayHabits = data.habits.filter(h => h.completedToday).length
  const overdueAssignments = data.assignments.filter(a => 
    new Date(a.due) < new Date() && a.status !== 'done'
  ).length
  const budgetUsed = Math.round((data.budget.spent / data.budget.budget) * 100)

  const navItems = [
    { 
      href: "/tasks", 
      icon: CheckSquare, 
      label: "Tasks", 
      count: pendingTasks,
      color: "bg-[#C1E1C1]"
    },
    { 
      href: "/assignments", 
      icon: BookOpen, 
      label: "Assignments", 
      count: overdueAssignments,
      color: overdueAssignments > 0 ? "bg-[#FFCC99]" : "bg-[#ADD8E6]"
    },
    { 
      href: "/habits", 
      icon: Target, 
      label: "Habits", 
      count: `${todayHabits}/${data.habits.length}`,
      color: "bg-[#C1E1C1]"
    },
    { 
      href: "/schedule", 
      icon: Calendar, 
      label: "Schedule", 
      count: data.events.length,
      color: "bg-[#ADD8E6]"
    },
    { 
      href: "/budget", 
      icon: DollarSign, 
      label: "Budget", 
      count: `${budgetUsed}%`,
      color: budgetUsed > 80 ? "bg-[#FFCC99]" : "bg-[#C1E1C1]"
    },
    { 
      href: "/study", 
      icon: Clock, 
      label: "Study", 
      count: data.studySessions,
      color: "bg-[#E6E6FA]"
    }
  ]

  return (
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant="outline" className="relative border-[#D2B48C] hover:bg-[#ADD8E6]/10">
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
            {item.count !== 0 && (
              <Badge className={`ml-2 ${item.color} text-white text-xs`}>
                {item.count}
              </Badge>
            )}
          </Button>
        </Link>
      ))}
    </nav>
  )
}