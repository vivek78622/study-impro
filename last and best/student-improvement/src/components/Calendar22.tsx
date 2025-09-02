"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Calendar22() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())

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
        <button key={`prev-${daysInPrevMonth - i}`} className="w-8 h-8 text-gray-500 hover:bg-gray-700 rounded">
          {daysInPrevMonth - i}
        </button>
      )
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = date && date.getDate() === day && date.getMonth() === currentMonth && date.getFullYear() === currentYear
      days.push(
        <button
          key={day}
          onClick={() => {
            setDate(new Date(currentYear, currentMonth, day))
            setOpen(false)
          }}
          className={`w-8 h-8 rounded hover:bg-gray-700 ${
            isSelected ? 'bg-white text-black' : 'text-white'
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
        <button key={`next-${day}`} className="w-8 h-8 text-gray-500 hover:bg-gray-700 rounded">
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1 text-gray-800 font-medium">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-gray-800 border-gray-600 text-white" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                <Select value={months[currentMonth]} onValueChange={(value) => setCurrentMonth(months.indexOf(value))}>
                  <SelectTrigger className="w-20 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {months.map((month) => (
                      <SelectItem key={month} value={month} className="text-white hover:bg-gray-600">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
                  <SelectTrigger className="w-20 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-600">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="w-8 h-8 flex items-center justify-center text-gray-400">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}