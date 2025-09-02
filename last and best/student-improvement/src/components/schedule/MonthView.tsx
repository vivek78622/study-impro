"use client"

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { motion } from 'framer-motion'
import { ScheduleEvent } from '../../../models/schedule'

interface MonthViewProps {
  selectedMonth: Date
  events: ScheduleEvent[]
  onDayClick: (date: Date) => void
  onEventClick: (event: ScheduleEvent) => void
}

const CATEGORY_COLORS = {
  class: 'text-[var(--accent)] border-[var(--accent)]',
  study: 'text-[var(--accent-2)] border-[var(--accent-2)]',
  exam: 'text-[var(--warn)] border-[var(--warn)]',
  meeting: 'text-muted-foreground border-muted',
  personal: 'text-muted-foreground border-muted',
  other: 'text-muted-foreground border-muted'
}

export default function MonthView({ selectedMonth, events, onDayClick, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(selectedMonth)
  const monthEnd = endOfMonth(selectedMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Pad to start on Monday
  const startDay = monthStart.getDay()
  const paddingDays = startDay === 0 ? 6 : startDay - 1
  
  const calendarDays = useMemo(() => {
    const days = []
    
    // Add padding days from previous month
    for (let i = paddingDays; i > 0; i--) {
      const day = new Date(monthStart)
      day.setDate(day.getDate() - i)
      days.push({ date: day, isCurrentMonth: false })
    }
    
    // Add current month days
    monthDays.forEach(day => {
      days.push({ date: day, isCurrentMonth: true })
    })
    
    // Pad to complete the grid (42 days = 6 weeks)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(monthEnd)
      day.setDate(day.getDate() + i)
      days.push({ date: day, isCurrentMonth: false })
    }
    
    return days
  }, [monthStart, monthEnd, monthDays, paddingDays])

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date.toDate(), date)
    ).sort((a, b) => a.start.localeCompare(b.start))
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-muted/20 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-muted/20">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground bg-muted/5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForDay(date)
          const isCurrentDay = isToday(date)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`min-h-[120px] p-2 border-r border-b border-muted/20 cursor-pointer hover:bg-muted/5 transition-colors ${
                isCurrentDay ? 'bg-accent/10 border-accent/30' : ''
              } ${!isCurrentMonth ? 'text-muted-foreground/50' : ''}`}
              onClick={() => onDayClick(date)}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentDay ? 'text-accent font-bold' : 'text-foreground'
              }`}>
                {format(date, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className={`text-xs p-1 rounded border-l-2 bg-card/80 hover:bg-card cursor-pointer truncate ${
                      CATEGORY_COLORS[event.category]
                    }`}
                    title={`${event.title} (${event.start} - ${event.end})`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-muted-foreground">{event.start}</div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}