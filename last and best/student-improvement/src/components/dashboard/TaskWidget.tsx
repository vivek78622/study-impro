"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToTasks } from '../../services/tasks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, ArrowRight, AlertTriangle, Calendar } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: any
}

export default function TaskWidget() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks)
      setLoading(false)
    })

    return unsubscribe
  }, [user?.uid])

  const getDaysUntilDue = (dueDate: any) => {
    const due = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const urgentTasks = tasks.filter(task => {
    if (task.status === 'done') return false
    const daysLeft = getDaysUntilDue(task.dueDate)
    return daysLeft <= 3 && daysLeft >= 0
  }).sort((a, b) => getDaysUntilDue(a.dueDate) - getDaysUntilDue(b.dueDate))

  const overdueTasks = tasks.filter(task => {
    if (task.status === 'done') return false
    return getDaysUntilDue(task.dueDate) < 0
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getDueDateColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600'
    if (daysLeft === 0) return 'text-orange-600'
    if (daysLeft <= 1) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getDueDateText = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`
    if (daysLeft === 0) return 'Due today'
    if (daysLeft === 1) return 'Due tomorrow'
    return `${daysLeft} days left`
  }

  if (loading) {
    return (
      <Card className="bg-white border-[#D2B48C]/30 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href="/tasks" className="block">
      <Card className="bg-white border-[#D2B48C]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#C1E1C1]" />
              Task Dashboard
              {(urgentTasks.length > 0 || overdueTasks.length > 0) && (
                <Badge className="bg-red-100 text-red-700 text-xs animate-pulse">
                  {overdueTasks.length + urgentTasks.length} urgent
                </Badge>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C1E1C1] transition-colors" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalTasks === 0 ? (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No tasks yet</p>
              <p className="text-xs text-gray-400">Click to add your first task</p>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#C1E1C1]">{completedTasks}</div>
                  <div className="text-xs text-gray-600">Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FFCC99]">{pendingTasks}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{overdueTasks.length + urgentTasks.length}</div>
                  <div className="text-xs text-gray-600">Urgent</div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium text-gray-800">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              {/* Urgent Tasks */}
              {(urgentTasks.length > 0 || overdueTasks.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Needs Attention
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {overdueTasks.slice(0, 2).map(task => {
                      const daysLeft = getDaysUntilDue(task.dueDate)
                      return (
                        <div key={task.id} className="p-2 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-red-800 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-red-600" />
                                <span className={`text-xs font-medium ${getDueDateColor(daysLeft)}`}>
                                  {getDueDateText(daysLeft)}
                                </span>
                              </div>
                            </div>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                    {urgentTasks.slice(0, 3 - overdueTasks.length).map(task => {
                      const daysLeft = getDaysUntilDue(task.dueDate)
                      return (
                        <div key={task.id} className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-yellow-800 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-yellow-600" />
                                <span className={`text-xs font-medium ${getDueDateColor(daysLeft)}`}>
                                  {getDueDateText(daysLeft)}
                                </span>
                              </div>
                            </div>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full border-[#D2B48C] hover:bg-[#C1E1C1]/10 group-hover:border-[#C1E1C1] text-sm">
                <CheckSquare className="w-4 h-4 mr-2" />
                Manage All Tasks
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}