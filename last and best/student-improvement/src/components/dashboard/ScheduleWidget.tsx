"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToScheduleEvents } from '../../services/schedule'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, CalendarDays, MapPin } from 'lucide-react'

interface ScheduleEvent {
  id: string
  title: string
  date: any
  start: string
  end: string
  category: 'Classes' | 'Study' | 'Personal' | 'Exams' | 'Deadlines'
  location?: string
  notes?: string
  priority?: 'low' | 'medium' | 'high'
}

export default function ScheduleWidget() {
  const { user } = useAuth()
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToScheduleEvents(user.uid, (fetchedEvents) => {
      // Filter and sort upcoming events
      const now = new Date()
      const upcoming = fetchedEvents
        .filter(event => {
          const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
          const eventDateTime = new Date(eventDate)
          const [hours, minutes] = event.start.split(':')
          eventDateTime.setHours(parseInt(hours), parseInt(minutes))
          return eventDateTime >= now
        })
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
          const timeA = new Date(dateA)
          const timeB = new Date(dateB)
          const [hoursA, minutesA] = a.start.split(':')
          const [hoursB, minutesB] = b.start.split(':')
          timeA.setHours(parseInt(hoursA), parseInt(minutesA))
          timeB.setHours(parseInt(hoursB), parseInt(minutesB))
          return timeA.getTime() - timeB.getTime()
        })
        .slice(0, 3)
      
      setEvents(upcoming)
      setLoading(false)
    })

    return unsubscribe
  }, [user?.uid])

  const getCategoryColor = (category: string) => {
    const colors = {
      'Classes': 'bg-blue-100 text-blue-700 border-blue-200',
      'Study': 'bg-green-100 text-green-700 border-green-200',
      'Personal': 'bg-purple-100 text-purple-700 border-purple-200',
      'Exams': 'bg-red-100 text-red-700 border-red-200',
      'Deadlines': 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const formatDate = (date: any) => {
    const eventDate = date?.toDate ? date.toDate() : new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (eventDate.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTimeUntilEvent = (date: any, startTime: string) => {
    const eventDate = date?.toDate ? date.toDate() : new Date(date)
    const [hours, minutes] = startTime.split(':')
    const eventDateTime = new Date(eventDate)
    eventDateTime.setHours(parseInt(hours), parseInt(minutes))
    
    const now = new Date()
    const diffMs = eventDateTime.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours < 1) {
      return `in ${diffMinutes}m`
    } else if (diffHours < 24) {
      return `in ${diffHours}h`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `in ${diffDays}d`
    }
  }

  if (loading) {
    return (
      <Card className="bg-white border-[#D2B48C]/30 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href="/schedule" className="block">
      <Card className="bg-white border-[#D2B48C]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#ADD8E6]" />
              Today's Schedule
              {events.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  {events.length} upcoming
                </Badge>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#ADD8E6] transition-colors" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-6">
              <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming events</p>
              <p className="text-xs text-gray-400">Your schedule is clear</p>
            </div>
          ) : (
            <>
              {events.map((event, index) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </Badge>
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-20">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-xs font-medium text-gray-600">
                        {formatDate(event.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTimeUntilEvent(event.date, event.start)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                    </div>
                    {event.priority && (
                      <Badge className={`text-xs ${
                        event.priority === 'high' ? 'bg-red-100 text-red-700' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {event.priority}
                      </Badge>
                    )}
                  </div>
                  
                  {event.notes && (
                    <p className="text-xs text-gray-500 mt-2 truncate">{event.notes}</p>
                  )}
                </div>
              ))}
              
              <Button variant="outline" className="w-full border-[#D2B48C] hover:bg-[#ADD8E6]/10 group-hover:border-[#ADD8E6] text-sm mt-3">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}