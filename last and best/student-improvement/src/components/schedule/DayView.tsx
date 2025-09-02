"use client"

import { useMemo, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Clock, MapPin, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ScheduleEvent {
  id: string
  title: string
  date: Date
  start: string
  end: string
  category: string
  location?: string
  notes?: string
  priority?: "low" | "medium" | "high"
  reminder?: boolean
}

interface DayViewProps {
  selectedDate: Date
  events: ScheduleEvent[]
  onEventClick?: (event: ScheduleEvent) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Classes: 'bg-[#ADD8E6]',
  Study: 'bg-[#C1E1C1]',
  Personal: 'bg-[#E6E6FA]',
  Exams: 'bg-[#FFCC99]',
  Deadlines: 'bg-[#D2B48C]',
}

export default function DayView({ selectedDate, events, onEventClick }: DayViewProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const dayEvents = useMemo(() => {
    return events.filter(event => 
      event.date.toDateString() === selectedDate.toDateString()
    ).sort((a, b) => a.start.localeCompare(b.start))
  }, [events, selectedDate])

  // Auto-scroll to current time
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date()
      const currentHour = now.getHours()
      const hourElement = timelineRef.current.querySelector(`[data-hour="${currentHour}"]`)
      if (hourElement) {
        hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedDate])

  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    return (hours * 60 + minutes) / (24 * 60) * 100
  }

  const getEventPosition = (event: ScheduleEvent) => {
    const [startHour, startMin] = event.start.split(':').map(Number)
    const [endHour, endMin] = event.end.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const top = (startMinutes / (24 * 60)) * 100
    const height = ((endMinutes - startMinutes) / (24 * 60)) * 100
    
    return { top: `${top}%`, height: `${Math.max(height, 2)}%` }
  }

  const isCurrentTime = () => {
    const now = new Date()
    return now.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#D2B48C]/20 overflow-hidden">
      <div className="p-4 border-b border-[#D2B48C]/20 bg-gradient-to-r from-[#F5F0E1] to-[#E6E6FA]/20">
        <h3 className="text-lg font-semibold text-gray-800">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>
      
      <div className="relative h-[600px] overflow-y-auto" ref={timelineRef}>
        <div className="relative min-h-full">
          {/* Hour grid */}
          {hours.map((hour) => (
            <div
              key={hour}
              data-hour={hour}
              className="relative border-b border-gray-100 h-16 flex"
            >
              <div className="w-16 flex-shrink-0 p-2 text-xs text-gray-500 font-medium bg-gray-50/50">
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
              </div>
              <div className="flex-1 relative">
                {/* Half-hour line */}
                <div className="absolute top-8 left-0 right-0 border-t border-gray-50" />
              </div>
            </div>
          ))}
          
          {/* Current time indicator */}
          {isCurrentTime() && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{ top: `${getCurrentTimePosition()}%` }}
            >
              <div className="flex items-center">
                <div className="w-16 flex justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="flex-1 h-0.5 bg-red-500" />
              </div>
            </div>
          )}
          
          {/* Events */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            {dayEvents.map((event) => {
              const position = getEventPosition(event)
              const categoryColor = CATEGORY_COLORS[event.category] || 'bg-gray-400'
              
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 ${categoryColor}/20 border-l-4 ${categoryColor.replace('bg-', 'border-')} rounded-r-lg p-2 cursor-pointer hover:shadow-md transition-all duration-200 z-10`}
                  style={position}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="min-h-full flex flex-col justify-center">
                    <h4 className="font-medium text-sm text-gray-800 line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{event.start} - {event.end}</span>
                      {event.location && (
                        <>
                          <MapPin className="w-3 h-3 ml-1" />
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                      {event.reminder && <Bell className="w-3 h-3 text-[#FFCC99]" />}
                    </div>
                    <Badge className={`${categoryColor} text-white text-xs mt-1 w-fit`}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}