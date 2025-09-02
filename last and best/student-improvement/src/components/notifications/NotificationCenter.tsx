"use client"

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle2, Clock, AlertTriangle, Target, Zap, Trophy, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardData } from '../../hooks/useDashboardData'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'reminder'
  title: string
  message: string
  action?: { label: string; onClick: () => void }
  timestamp: Date
  read: boolean
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { tasks, habits, assignments, studySessions } = useDashboardData()

  useEffect(() => {
    const newNotifications: Notification[] = []
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const hour = now.getHours()

    // Smart overdue task prioritization
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate < today && task.status !== 'done'
    }).sort((a, b) => a.priority === 'high' ? -1 : 1)
    
    if (overdueTasks.length > 0) {
      const urgentTasks = overdueTasks.filter(t => t.priority === 'high')
      newNotifications.push({
        id: 'overdue-tasks',
        type: 'warning',
        title: urgentTasks.length > 0 ? `🚨 ${urgentTasks.length} Urgent Overdue` : `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`,
        message: urgentTasks.length > 0 ? `High priority: "${urgentTasks[0].title}"` : `"${overdueTasks[0].title}" needs attention`,
        action: { label: 'Fix Now', onClick: () => window.location.href = '/tasks' },
        timestamp: now,
        read: false
      })
    }

    // Smart habit streak notifications
    const streakHabits = habits.filter(habit => habit.streak >= 3)
    const todayIncomplete = habits.filter(habit => !habit.completedToday)
    
    if (streakHabits.length > 0 && streakHabits[0].streak >= 7) {
      newNotifications.push({
        id: 'habit-streak',
        type: 'success',
        title: `🔥 ${streakHabits[0].streak} Day Streak!`,
        message: `${streakHabits[0].name} - You're on fire! Keep it up!`,
        timestamp: now,
        read: false
      })
    } else if (todayIncomplete.length > 0 && hour >= 18) {
      newNotifications.push({
        id: 'habit-reminder',
        type: 'reminder',
        title: '⏰ Evening Habit Check',
        message: `Don't break your ${todayIncomplete[0].name} streak! ${todayIncomplete[0].streak} days strong`,
        action: { label: 'Complete Now', onClick: () => window.location.href = '/habits' },
        timestamp: now,
        read: false
      })
    }

    // Smart study session recommendations
    const todaySessions = studySessions.filter(session => {
      const sessionDate = new Date(session.startTime)
      return sessionDate.toDateString() === today.toDateString()
    })
    
    if (todaySessions.length === 0) {
      if (hour >= 9 && hour <= 11) {
        newNotifications.push({
          id: 'morning-focus',
          type: 'info',
          title: '🌅 Perfect Morning Focus Time',
          message: 'Your brain is at peak performance. Start a 25min session?',
          action: { label: 'Focus Now', onClick: () => window.location.href = '/study' },
          timestamp: now,
          read: false
        })
      } else if (hour >= 14 && hour <= 16) {
        newNotifications.push({
          id: 'afternoon-boost',
          type: 'info',
          title: '⚡ Afternoon Energy Boost',
          message: 'Beat the afternoon slump with a focused study session',
          action: { label: 'Start Session', onClick: () => window.location.href = '/study' },
          timestamp: now,
          read: false
        })
      }
    }

    // Smart assignment deadline management
    const upcomingAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.due)
      const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7 && daysDiff > 0 && assignment.status !== 'done'
    }).sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())

    if (upcomingAssignments.length > 0) {
      const nextAssignment = upcomingAssignments[0]
      const daysLeft = Math.ceil((new Date(nextAssignment.due).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const progress = nextAssignment.progress || 0
      
      if (daysLeft <= 1 && progress < 80) {
        newNotifications.push({
          id: 'assignment-urgent',
          type: 'warning',
          title: '🚨 Assignment Due Tomorrow!',
          message: `"${nextAssignment.title}" is ${progress}% complete. Time to finish!`,
          action: { label: 'Work Now', onClick: () => window.location.href = '/assignments' },
          timestamp: now,
          read: false
        })
      } else if (daysLeft <= 3 && progress < 50) {
        newNotifications.push({
          id: 'assignment-reminder',
          type: 'reminder',
          title: '📝 Assignment Progress Check',
          message: `"${nextAssignment.title}" due in ${daysLeft} days (${progress}% done)`,
          action: { label: 'Continue Work', onClick: () => window.location.href = '/assignments' },
          timestamp: now,
          read: false
        })
      }
    }

    // Smart productivity insights
    const completedToday = tasks.filter(task => task.status === 'done')
    
    if (completedToday.length >= 5) {
      newNotifications.push({
        id: 'productivity-high',
        type: 'success',
        title: '🚀 Productivity Superstar!',
        message: `${completedToday.length} tasks completed today! You're unstoppable!`,
        timestamp: now,
        read: false
      })
    } else if (completedToday.length === 0 && hour >= 16) {
      const pendingToday = tasks.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate.toDateString() === today.toDateString() && task.status !== 'done'
      })
      
      if (pendingToday.length > 0) {
        newNotifications.push({
          id: 'daily-push',
          type: 'info',
          title: '💪 Daily Goal Push',
          message: `${pendingToday.length} tasks left today. You've got this!`,
          action: { label: 'Finish Strong', onClick: () => window.location.href = '/tasks' },
          timestamp: now,
          read: false
        })
      }
    }

    setNotifications(newNotifications)
  }, [tasks, habits, assignments, studySessions])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getIcon = (type: string, title: string) => {
    if (title.includes('🔥') || title.includes('Streak')) return <Trophy className="w-4 h-4 text-[#FFCC99]" />
    if (title.includes('🚨') || title.includes('Urgent')) return <AlertTriangle className="w-4 h-4 text-red-500" />
    if (title.includes('🌅') || title.includes('⚡') || title.includes('💪')) return <Zap className="w-4 h-4 text-[#ADD8E6]" />
    if (title.includes('🚀') || title.includes('Superstar')) return <Trophy className="w-4 h-4 text-[#C1E1C1]" />
    
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-[#C1E1C1]" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-[#FFCC99]" />
      case 'reminder': return <Clock className="w-4 h-4 text-[#ADD8E6]" />
      default: return <Brain className="w-4 h-4 text-[#E6E6FA]" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/20"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#FFCC99] text-gray-800 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm border-[#D2B48C]/40 shadow-xl z-50">
          <div className="p-4 border-b border-[#D2B48C]/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#D2B48C]/10 hover:bg-[#F5F0E1]/50 transition-colors ${
                      !notification.read ? 'bg-[#C1E1C1]/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type, notification.title)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 h-7 text-xs border-[#D2B48C] hover:bg-[#C1E1C1]/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.action!.onClick()
                              setIsOpen(false)
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#FFCC99] rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default NotificationCenter