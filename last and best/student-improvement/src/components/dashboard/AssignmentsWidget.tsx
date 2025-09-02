"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Assignment {
  id: string
  title: string
  subject: string
  status: string
  due: any
  progress: number
}

interface AssignmentsWidgetProps {
  assignments: Assignment[]
  loading: boolean
}

export default function AssignmentsWidget({ assignments, loading }: AssignmentsWidgetProps) {
  const pendingAssignments = assignments.filter(a => a.status !== 'graded').slice(0, 3)
  const overdueCount = assignments.filter(a => {
    const dueDate = new Date(a.due)
    return dueDate < new Date() && a.status !== 'graded'
  }).length

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
            <BookOpen className="w-5 h-5 text-[#D2B48C]" />
            Assignments
          </CardTitle>
          <Link href="/assignments">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600">
          {pendingAssignments.length} pending
          {overdueCount > 0 && <span className="text-red-600 ml-1">• {overdueCount} overdue</span>}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingAssignments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">No pending assignments</p>
            <Link href="/assignments">
              <Button size="sm" className="bg-[#D2B48C] hover:bg-[#D2B48C]/90 text-white">
                Add Assignment
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {pendingAssignments.map((assignment) => {
              const dueDate = new Date(assignment.due)
              const isOverdue = dueDate < new Date()
              
              return (
                <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{assignment.title}</p>
                      <p className="text-xs text-gray-600">{assignment.subject}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ml-2 ${
                        isOverdue ? 'border-red-200 text-red-700' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span className={isOverdue ? 'text-red-600' : ''}>
                        Due {dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-[#D2B48C] h-1.5 rounded-full transition-all" 
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <Link href="/assignments">
              <Button variant="outline" size="sm" className="w-full mt-3 border-[#D2B48C]/40">
                View All Assignments
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}