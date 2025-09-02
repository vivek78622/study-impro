"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarPickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  id?: string
  className?: string
}

export function CalendarPicker({ 
  date, 
  onSelect, 
  placeholder = "Select date", 
  label,
  id,
  className = ""
}: CalendarPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-between font-normal border-[#D2B48C] hover:bg-[#ADD8E6]/20"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onSelect?.(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}