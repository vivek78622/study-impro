"use client"

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-muted/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="hover:bg-muted/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="hover:bg-muted/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)
          
          return (
            <Button
              key={day.toISOString()}
              variant="ghost"
              size="sm"
              onClick={() => onDateSelect(day)}
              className={`h-8 w-8 p-0 text-sm ${
                isSelected ? 'bg-accent text-accent-foreground' : 
                isCurrentDay ? 'bg-muted text-foreground font-bold' : 
                'hover:bg-muted/10'
              }`}
            >
              {format(day, 'd')}
            </Button>
          )
        })}
      </div>
    </div>
  )
}