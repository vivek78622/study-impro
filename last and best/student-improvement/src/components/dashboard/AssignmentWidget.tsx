"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToAssignments } from '../../services/assignments'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, ArrowRight, AlertTriangle, Calendar, GraduationCap } from 'lucide-react'

interface Assignment {
  id: string
  title: string
  subject: string
  status: 'not_started' | 'in_progress' | 'done'
  progress: number
  due: any
  grade?: string
}

export default function AssignmentWidget() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToAssignments(user.uid, (fetchedAssignments) => {
      setAssignments(fetchedAssignments)
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

  const totalAssignments = assignments.length
  const completedAssignments = assignments.filter(a => a.status === 'done').length
  const overdueAssignments = assignments.filter(a => {
    if (a.status === 'done') return false
    return getDaysUntilDue(a.due) < 0
  })
  const urgentAssignments = assignments.filter(a => {
    if (a.status === 'done') return false
    const daysLeft = getDaysUntilDue(a.due)
    return daysLeft <= 3 && daysLeft >= 0
  }).sort((a, b) => getDaysUntilDue(a.due) - getDaysUntilDue(b.due))

  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
  const averageProgress = totalAssignments > 0 ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / totalAssignments) : 0

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-700 border-blue-200',
      'Physics': 'bg-purple-100 text-purple-700 border-purple-200',
      'Chemistry': 'bg-green-100 text-green-700 border-green-200',
      'Biology': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'History': 'bg-amber-100 text-amber-700 border-amber-200',
      'English': 'bg-rose-100 text-rose-700 border-rose-200',
      'Computer Science': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    }
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getDueDateColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600'
    if (daysLeft === 0) return 'text-orange-600'
    if (daysLeft <= 2) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getDueDateText = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`
    if (daysLeft === 0) return 'Due today'
    if (daysLeft === 1) return 'Due tomorrow'
    return `${daysLeft}d left`
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
    <Link href="/assignments" className="block">
      <Card className="bg-white border-[#D2B48C]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FFCC99]" />
              Assignment Tracker
              {(urgentAssignments.length > 0 || overdueAssignments.length > 0) && (
                <Badge className="bg-red-100 text-red-700 text-xs animate-pulse">
                  {overdueAssignments.length + urgentAssignments.length} urgent
                </Badge>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFCC99] transition-colors" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalAssignments === 0 ? (
            <div className="text-center py-4">
              <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No assignments yet</p>
              <p className="text-xs text-gray-400">Click to add your first assignment</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-[#C1E1C1]">{completedAssignments}</div>
                  <div className="text-xs text-gray-600">Done</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#ADD8E6]">{totalAssignments - completedAssignments}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-red-500">{overdueAssignments.length}</div>
                  <div className="text-xs text-gray-600">Overdue</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#FFCC99]">{averageProgress}%</div>
                  <div className="text-xs text-gray-600">Avg</div>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-800">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Average Progress</span>
                    <span className="font-medium text-gray-800">{averageProgress}%</span>
                  </div>
                  <Progress value={averageProgress} className="h-1.5" />
                </div>
              </div>

              {/* Urgent Assignments */}
              {(urgentAssignments.length > 0 || overdueAssignments.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Needs Attention
                  </div>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {overdueAssignments.slice(0, 2).map(assignment => {
                      const daysLeft = getDaysUntilDue(assignment.due)
                      return (
                        <div key={assignment.id} className="p-2 bg-red-50 rounded-md border border-red-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-red-800 truncate">{assignment.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`text-xs px-1 py-0 ${getSubjectColor(assignment.subject)}`}>
                                  {assignment.subject}
                                </Badge>
                                <span className={`text-xs font-medium ${getDueDateColor(daysLeft)}`}>
                                  {getDueDateText(daysLeft)}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-red-700">
                              {assignment.progress}%
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {urgentAssignments.slice(0, 3 - overdueAssignments.length).map(assignment => {
                      const daysLeft = getDaysUntilDue(assignment.due)
                      return (
                        <div key={assignment.id} className="p-2 bg-yellow-50 rounded-md border border-yellow-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-yellow-800 truncate">{assignment.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`text-xs px-1 py-0 ${getSubjectColor(assignment.subject)}`}>
                                  {assignment.subject}
                                </Badge>
                                <span className={`text-xs font-medium ${getDueDateColor(daysLeft)}`}>
                                  {getDueDateText(daysLeft)}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-yellow-700">
                              {assignment.progress}%
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full border-[#D2B48C] hover:bg-[#FFCC99]/10 group-hover:border-[#FFCC99] text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Assignments
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}