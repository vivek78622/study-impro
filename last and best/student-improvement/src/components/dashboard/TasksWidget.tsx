"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate: any
}

interface TasksWidgetProps {
  tasks: Task[]
  loading: boolean
}

export default function TasksWidget({ tasks, loading }: TasksWidgetProps) {
  const recentTasks = tasks.slice(0, 4)
  const completedToday = tasks.filter(t => t.status === 'done').length

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
            <CheckCircle2 className="w-5 h-5 text-[#C1E1C1]" />
            Tasks
          </CardTitle>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600">{completedToday} completed today</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTasks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">No tasks yet</p>
            <Link href="/tasks">
              <Button size="sm" className="bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                {task.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#C1E1C1]" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        task.priority === 'high' ? 'border-red-200 text-red-700' :
                        task.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-green-200 text-green-700'
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/tasks">
              <Button variant="outline" size="sm" className="w-full mt-3 border-[#D2B48C]/40">
                View All Tasks
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}