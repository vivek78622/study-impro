"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DayView from '../../../components/schedule/DayView'
import Calendar from '../../../components/schedule/Calendar'
import EventModal from '../../../components/schedule/EventModal'
import { ScheduleEvent, CreateScheduleEvent } from '../../../../models/schedule'
import { subscribeToScheduleByDate, createScheduleEvent } from '../../../services/scheduleDayService'

export default function ScheduleDayPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [loading, setLoading] = useState(true)

  // Subscribe to events for selected date
  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)
    const unsubscribe = subscribeToScheduleByDate(user.uid, selectedDate, (fetchedEvents) => {
      setEvents(fetchedEvents)
      setLoading(false)
    })

    return unsubscribe
  }, [user?.uid, selectedDate])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const handleAddEvent = async (eventData: CreateScheduleEvent) => {
    if (!user?.uid) return
    
    try {
      await createScheduleEvent(user.uid, {
        ...eventData,
        date: selectedDate
      })
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event)
    // Could open edit modal here
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <motion.header 
          initial={reduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-[#D2B48C]/20"
        >
          <div className="max-w-screen-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousDay}
                  className="hover:bg-accent/20"
                  aria-label="Previous day"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToday}
                  className="border-[#D2B48C]/30 hover:bg-accent/20"
                >
                  Today
                </Button>
                
                <Select value="day" disabled>
                  <SelectTrigger className="w-32 border-[#D2B48C]/30">
                    <SelectValue />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day view</SelectItem>
                    <SelectItem value="week" disabled>Week view</SelectItem>
                    <SelectItem value="month" disabled>Month view</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center">
                <h1 className="text-lg font-semibold text-foreground">
                  {formatDate(selectedDate)}
                </h1>
              </div>

              <Button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-accent hover:bg-accent/90 text-white"
                aria-label="Add event"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add event
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Timeline - Left Column */}
            <motion.div 
              initial={reduceMotion ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 bg-card rounded-2xl shadow-lg overflow-hidden"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No events scheduled</h3>
                  <p className="text-gray-600 mb-4">No events scheduled for this day.</p>
                  <Button
                    onClick={() => setIsEventModalOpen(true)}
                    className="bg-accent hover:bg-accent/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add event
                  </Button>
                </div>
              ) : (
                <DayView
                  events={events}
                  selectedDate={selectedDate}
                  onEventClick={handleEventClick}
                />
              )}
            </motion.div>

            {/* Calendar - Right Column */}
            <motion.div 
              initial={reduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </motion.div>

            {/* Mobile Calendar Drawer - Hidden on desktop */}
            <div className="lg:hidden">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleAddEvent}
          selectedDate={selectedDate}
        />
      </div>
    </ProtectedRoute>
  )
}