"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Play, ArrowRight } from "lucide-react"
import Link from "next/link"

interface StudySession {
  id: string
  mode: string
  status: string
  startTime: any
}

interface StudyWidgetProps {
  sessions: StudySession[]
  loading: boolean
}

export default function StudyWidget({ sessions, loading }: StudyWidgetProps) {
  const completedToday = sessions.filter(s => s.status === 'completed').length
  const totalMinutes = completedToday * 25 // Assuming 25min sessions

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
            <Clock className="w-5 h-5 text-[#FFCC99]" />
            Focus Timer
          </CardTitle>
          <Link href="/study">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600">{totalMinutes} minutes today</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E6E6FA"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FFCC99"
                strokeWidth="3"
                strokeDasharray={`${(completedToday / 8) * 100}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">25:00</span>
              <span className="text-xs text-gray-600">Ready to start</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">{completedToday}</p>
              <p className="text-xs text-gray-600">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
              <p className="text-xs text-gray-600">Focus Time</p>
            </div>
          </div>
          
          <Link href="/study">
            <Button className="w-full bg-[#FFCC99] hover:bg-[#FFCC99]/90 text-white">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}