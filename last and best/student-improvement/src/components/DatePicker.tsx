"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
}

export function DatePicker({ 
  label = "Date of birth", 
  value, 
  onChange, 
  placeholder = "Select date" 
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(value?.getMonth() ?? new Date().getMonth())
  const [currentYear, setCurrentYear] = React.useState(value?.getFullYear() ?? new Date().getFullYear())

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    onChange?.(selectedDate)
    setOpen(false)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []
    
    // Previous month's trailing days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear)
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <button 
          key={`prev-${daysInPrevMonth - i}`} 
          className="w-9 h-9 text-gray-400 hover:bg-[#C1E1C1]/20 rounded-lg text-sm font-medium transition-colors"
          onClick={() => {
            setCurrentMonth(prevMonth)
            setCurrentYear(prevYear)
          }}
        >
          {daysInPrevMonth - i}
        </button>
      )
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && 
        value.getDate() === day && 
        value.getMonth() === currentMonth && 
        value.getFullYear() === currentYear
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleDateSelect(day)
          }}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isSelected 
              ? 'bg-gradient-to-br from-[#C1E1C1] to-[#B5D6B5] text-gray-800 shadow-md scale-105' 
              : 'text-gray-700 hover:bg-[#C1E1C1]/30 hover:scale-105'
          }`}
        >
          {day}
        </button>
      )
    }
    
    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button 
          key={`next-${day}`} 
          className="w-9 h-9 text-gray-400 hover:bg-[#C1E1C1]/20 rounded-lg text-sm font-medium transition-colors"
          onClick={() => {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
            setCurrentMonth(nextMonth)
            setCurrentYear(nextYear)
          }}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <Label htmlFor="date" className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id="date"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(!open)
            }}
            className="w-full h-12 justify-between font-normal bg-white/90 backdrop-blur-sm border-2 border-[#D2B48C]/40 text-gray-700 hover:bg-white hover:border-[#C1E1C1] focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
          >
            {value ? value.toLocaleDateString() : placeholder}
            <ChevronDown className="w-4 h-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0 bg-white/95 backdrop-blur-xl border-2 border-[#D2B48C]/40 shadow-2xl rounded-xl z-[9999]" 
          align="center"
          side="bottom"
          sideOffset={4}
        >
          <div className="p-6 space-y-4">
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11)
                    setCurrentYear(currentYear - 1)
                  } else {
                    setCurrentMonth(currentMonth - 1)
                  }
                }}
                className="h-9 w-9 p-0 hover:bg-[#C1E1C1]/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-lg font-semibold text-gray-800">
                {months[currentMonth]} {currentYear}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0)
                    setCurrentYear(currentYear + 1)
                  } else {
                    setCurrentMonth(currentMonth + 1)
                  }
                }}
                className="h-9 w-9 p-0 hover:bg-[#C1E1C1]/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <div className="space-y-3">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center border-b border-[#D2B48C]/20 pb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="w-9 h-7 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}