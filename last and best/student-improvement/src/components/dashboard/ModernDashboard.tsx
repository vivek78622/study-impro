"use client"

import { useAuth } from '../../contexts/AuthContext'
import UserDropdown from '../UserDropdown'
import NotificationCenter from '../notifications/NotificationCenter'
import BudgetWidget from './BudgetWidget'
import TaskWidget from './TaskWidget'
import AssignmentWidget from './AssignmentWidget'
import ScheduleWidget from './ScheduleWidget'
import HabitWidget from './HabitWidget'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Code2, 
  FileText, 
  Calendar, 
  Flame, 
  Award, 
  ClipboardCheck, 
  Lightbulb,
  ArrowUpRight,
  Plus,
  Bell
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

const chartData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 1.8 },
  { name: 'Wed', hours: 3.2 },
  { name: 'Thu', hours: 2.9 },
  { name: 'Fri', hours: 4.1 },
  { name: 'Sat', hours: 3.5 },
  { name: 'Sun', hours: 1.2 }
]

export default function ModernDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FBFF] to-[#F5F0E1] p-4 lg:p-8 relative">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-[#B8B8FF]" />
            <span className="text-xl font-semibold">StudyFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 bg-white shadow-sm rounded-full p-1">
            <Button variant="ghost" className="bg-[#B8B8FF]/20 text-[#B8B8FF] rounded-full">Dashboard</Button>
          </nav>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <UserDropdown user={user} />
          </div>
        </header>

        {/* Welcome */}
        <h1 className="text-3xl font-semibold mb-8">Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'} 👋</h1>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Budget Widget */}
          <div className="xl:col-span-2">
            <BudgetWidget />
          </div>

          {/* Task Widget */}
          <TaskWidget />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Assignment Widget */}
          <AssignmentWidget />

          {/* Schedule Widget */}
          <ScheduleWidget />

          {/* Habit Widget */}
          <HabitWidget />


        </div>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a href="/tasks" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-[#C9E4DE]/50 p-4 rounded-full group-hover:bg-[#C9E4DE] transition-colors">
                  <ClipboardCheck className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Task</p>
                  <p className="font-semibold text-sm">Management</p>
                </div>
              </div>
            </Card>
          </a>

          <a href="/schedule" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-[#B8B8FF]/50 p-4 rounded-full group-hover:bg-[#B8B8FF] transition-colors">
                  <Calendar className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Schedule</p>
                  <p className="font-semibold text-sm">Planner</p>
                </div>
              </div>
            </Card>
          </a>

          <a href="/assignments" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-[#FFDAB9]/50 p-4 rounded-full group-hover:bg-[#FFDAB9] transition-colors">
                  <FileText className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Assignment</p>
                  <p className="font-semibold text-sm">Tracker</p>
                </div>
              </div>
            </Card>
          </a>

          <a href="/study" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Study</p>
                  <p className="font-semibold text-sm">Mode</p>
                </div>
              </div>
            </Card>
          </a>

          <a href="/habits" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition-colors">
                  <Flame className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Habit</p>
                  <p className="font-semibold text-sm">Tracking</p>
                </div>
              </div>
            </Card>
          </a>

          <a href="/budget" className="group">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-yellow-100 p-4 rounded-full group-hover:bg-yellow-200 transition-colors">
                  <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">Budget</p>
                  <p className="font-semibold text-sm">Manager</p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}