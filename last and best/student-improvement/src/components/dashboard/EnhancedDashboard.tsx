"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDashboardData } from '../../hooks/useDashboardData'
import UserDropdown from '../UserDropdown'
import NotificationCenter from '../notifications/NotificationCenter'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Search,
  FileText, 
  Calendar, 
  Target, 
  Clock,
  ClipboardCheck, 
  DollarSign,
  Play,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"

const getCurrentDate = () => {
  const now = new Date()
  return {
    time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    date: now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }
}

export default function EnhancedDashboard() {
  const { user } = useAuth()
  const { tasks, habits, assignments, schedule, studySessions, expenses, loading, toggleHabit } = useDashboardData()
  const [currentTime, setCurrentTime] = useState(getCurrentDate())
  const [focusTime, setFocusTime] = useState(25 * 60)
  const [isTimerActive, setIsTimerActive] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentDate())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime(time => time - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, focusTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const completedTasks = tasks.filter(t => t.status === 'done').length
  const totalStudyHours = studySessions.reduce((acc, session) => {
    if (session.status === 'completed') {
      const duration = session.mode === '25min' ? 0.42 : 1
      return acc + duration
    }
    return acc
  }, 0)

  const activeHabits = habits.filter(h => h.completedToday).length
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0)
  const budgetRemaining = Math.max(0, 100 - Math.round((totalExpenses / 1000) * 100))

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1E1C1]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E1] p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C1E1C1] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">StudyFlow</span>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search tasks, habits, notes..." 
                className="pl-10 bg-white border-[#D2B48C]/30 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-lg font-semibold text-gray-800">{currentTime.time}</div>
              <div className="text-sm text-gray-600">{currentTime.date}</div>
            </div>
            <NotificationCenter />
            <UserDropdown user={user} />
          </div>
        </header>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#C1E1C1]/30 to-[#ADD8E6]/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Jane'}! 👋
              </h1>
              <p className="text-gray-600">Master your time, achieve your goals</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => window.open('https://chat.openai.com', '_blank')}
                className="bg-[#C1E1C1] hover:bg-[#B5D6B5] text-gray-800 rounded-xl"
              >
                Start Focus Session
              </Button>
              <Button 
                variant="outline" 
                className="border-[#D2B48C] hover:bg-[#D2B48C]/10 rounded-xl"
                onClick={() => window.location.href = '/tasks'}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C1E1C1]/20 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[#C1E1C1]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{completedTasks}</div>
                  <div className="text-sm text-gray-600">Tasks Done Today</div>
                  <div className="text-xs text-green-600">+3 vs yesterday</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ADD8E6]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#ADD8E6]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{totalStudyHours.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Study Hours (week)</div>
                  <div className="text-xs text-blue-600">+2 hrs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFCC99]/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#FFCC99]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{activeHabits}</div>
                  <div className="text-sm text-gray-600">Active Habits Consistent</div>
                  <div className="text-xs text-orange-600">+1 vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{budgetRemaining}</div>
                  <div className="text-sm text-gray-600">Budget Remaining (%)</div>
                  <div className="text-xs text-red-600">-$50 vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar Widget */}
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">September 2025</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">Today's schedule</div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className={`text-center text-sm py-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    i === 1 ? 'bg-[#C1E1C1] text-white' : 'text-gray-700'
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">2:00 PM</span>
                  <span className="font-medium">Math Homework</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600">4:00 PM</span>
                  <span className="font-medium">Study Session</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600">6:00 PM</span>
                  <span className="font-medium">Physics Lab Report</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habits Widget */}
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Habits</CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">Build consistency, one day at a time</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      habit.completedToday ? 'bg-[#C1E1C1]' : 'bg-gray-200'
                    }`}>
                      <Target className={`w-4 h-4 ${
                        habit.completedToday ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{habit.name}</div>
                      <div className="text-xs text-gray-500">{habit.streak} day streak</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">this week</div>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full text-[#C1E1C1] hover:bg-[#C1E1C1]/10"
                onClick={() => window.location.href = '/habits'}
              >
                View All Habits
              </Button>
            </CardContent>
          </Card>

          {/* Focus Session Widget */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Focus Session</CardTitle>
                <Badge className="bg-purple-100 text-purple-700 border-0">Built with ❤️ Loveable</Badge>
              </div>
              <div className="text-sm text-gray-600">Stay focused, achieve more.</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-4">{formatTime(focusTime)}</div>
              <div className="flex justify-center gap-2 mb-4">
                <Button 
                  variant={focusTime === 15 * 60 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFocusTime(15 * 60)}
                  className="rounded-full"
                >
                  15m
                </Button>
                <Button 
                  variant={focusTime === 25 * 60 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFocusTime(25 * 60)}
                  className="rounded-full"
                >
                  25m
                </Button>
                <Button 
                  variant={focusTime === 45 * 60 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFocusTime(45 * 60)}
                  className="rounded-full"
                >
                  45m
                </Button>
                <Button 
                  variant={focusTime === 60 * 60 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFocusTime(60 * 60)}
                  className="rounded-full"
                >
                  60m
                </Button>
              </div>
              <Button 
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="bg-[#C1E1C1] hover:bg-[#B5D6B5] text-gray-800 rounded-xl w-full mb-3"
              >
                <Play className="w-4 h-4 mr-2" />
                {isTimerActive ? 'Pause' : 'Start'}
              </Button>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <div className="text-sm text-gray-600">Common tasks at your fingertips</div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-[#C1E1C1] hover:bg-[#C1E1C1]/10"
                  onClick={() => window.location.href = '/tasks'}
                >
                  <ClipboardCheck className="w-5 h-5 text-[#C1E1C1]" />
                  <span className="text-xs">Add new task</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-[#ADD8E6] hover:bg-[#ADD8E6]/10"
                  onClick={() => window.location.href = '/schedule'}
                >
                  <Calendar className="w-5 h-5 text-[#ADD8E6]" />
                  <span className="text-xs">Schedule event</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-[#FFCC99] hover:bg-[#FFCC99]/10"
                  onClick={() => window.location.href = '/study'}
                >
                  <Clock className="w-5 h-5 text-[#FFCC99]" />
                  <span className="text-xs">Start session</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-[#E6E6FA] hover:bg-[#E6E6FA]/10"
                  onClick={() => window.location.href = '/habits'}
                >
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Track habit</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-yellow-300 hover:bg-yellow-50"
                  onClick={() => window.location.href = '/budget'}
                >
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs">Log expense</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1 border-gray-300 hover:bg-gray-50"
                  onClick={() => window.location.href = '/assignments'}
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-xs">Quick note</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <div className="text-sm text-gray-600">Your latest accomplishments</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Completed "Math HW"</div>
                  <div className="text-xs text-gray-500">2 min ago</div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">Tasks</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">25min study session</div>
                  <div className="text-xs text-gray-500">15 min ago</div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Study</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">7 Day Streak</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Achievement</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Read 10 Pages</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">Habits</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}