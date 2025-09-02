"use client"

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProtectedRoute from '../../../components/ProtectedRoute'
import MonthView from '../../../components/schedule/MonthView'
import EventModal from '../../../components/schedule/EventModal'
import { useAuth } from '../../../contexts/AuthContext'
import { subscribeToMonthEvents, createScheduleEvent, updateScheduleEvent, deleteScheduleEvent } from '../../../services/scheduleMonthService'
import { ScheduleEvent, CreateScheduleEvent } from '../../../models/schedule'

export default function ScheduleMonthPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    if (!user) return

    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)
    
    const unsubscribe = subscribeToMonthEvents(
      user.uid,
      monthStart,
      monthEnd,
      (monthEvents) => {
        setEvents(monthEvents)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user, selectedMonth])

  const handlePrevMonth = () => setSelectedMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1))
  const handleToday = () => setSelectedMonth(new Date())

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setSelectedDate(null)
    setModalOpen(true)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setModalOpen(true)
  }

  const handleCreateEvent = async (eventData: CreateScheduleEvent) => {
    if (!user) return
    await createScheduleEvent(user.uid, eventData)
  }

  const handleUpdateEvent = async (eventId: string, updates: Partial<ScheduleEvent>) => {
    await updateScheduleEvent(eventId, updates)
  }

  const handleDeleteEvent = async (eventId: string) => {
    await deleteScheduleEvent(eventId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-muted/20 -mx-6 px-6 py-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/schedule')}
                  className="border-muted/30 hover:bg-muted/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="hover:bg-muted/10"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <h1 className="text-2xl font-bold text-foreground">
                  {format(selectedMonth, 'MMMM yyyy')}
                </h1>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="hover:bg-muted/10"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleToday}
                  className="border-muted text-muted-foreground hover:bg-muted/10"
                >
                  Today
                </Button>
                
                <Select value="month" disabled>
                  <SelectTrigger className="w-32 border-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day" disabled>Day</SelectItem>
                    <SelectItem value="week" disabled>Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAddEvent}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  aria-label="Add event"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add event
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {loading ? (
              <div className="bg-card rounded-2xl shadow-lg border border-muted/20 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-4 bg-muted/20 rounded" />
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted/10 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <MonthView
                selectedMonth={selectedMonth}
                events={events}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
              />
            )}
          </motion.div>

          {/* Empty State */}
          {!loading && events.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground mb-4">No events scheduled this month.</p>
              <Button
                onClick={handleAddEvent}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first event
              </Button>
            </motion.div>
          )}
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          initialData={selectedEvent || undefined}
          selectedDate={selectedDate || undefined}
          mode={selectedEvent ? 'edit' : 'create'}
        />
      </div>
    </ProtectedRoute>
  )
}