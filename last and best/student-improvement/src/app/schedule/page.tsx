"use client"

import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, startOfWeek, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { CalendarIcon, Plus, Filter, Clock, MapPin, List, Search, TrendingUp, Bell, Sparkles, Home, ChevronLeft, ChevronRight, Target, BarChart3, Zap, CheckCircle2, AlertCircle, Timer, BookOpen, Users, Award, Edit, Trash2, MoreVertical } from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToScheduleEvents, createScheduleEvent, updateScheduleEvent, deleteScheduleEvent } from '../../services/schedule'
import ProtectedRoute from '../../components/ProtectedRoute'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

import CreateEventForm from "./CreateEventForm"
import DayView from "@/components/schedule/DayView"

export type Category = "Classes" | "Study" | "Personal" | "Exams" | "Deadlines"

interface ScheduleEvent {
  id: string
  title: string
  date: Date
  start: string
  end: string
  category: Category
  location?: string
  notes?: string
  priority?: "low" | "medium" | "high"
  reminder?: boolean
}

const CATEGORY_META: Record<Category, { color: string; tone: string; gradient: string }> = {
  Classes: { color: "bg-[#ADD8E6]", tone: "bg-[#ADD8E6]/20", gradient: "from-[#ADD8E6] to-[#ADD8E6]/70" },
  Study: { color: "bg-[#C1E1C1]", tone: "bg-[#C1E1C1]/20", gradient: "from-[#C1E1C1] to-[#C1E1C1]/70" },
  Personal: { color: "bg-[#E6E6FA]", tone: "bg-[#E6E6FA]/30", gradient: "from-[#E6E6FA] to-[#E6E6FA]/70" },
  Exams: { color: "bg-[#FFCC99]", tone: "bg-[#FFCC99]/30", gradient: "from-[#FFCC99] to-[#FFCC99]/70" },
  Deadlines: { color: "bg-[#D2B48C]", tone: "bg-[#D2B48C]/30", gradient: "from-[#D2B48C] to-[#D2B48C]/70" },
}



function sameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate()
}

export default function Schedule() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [filters, setFilters] = useState<Record<Category, boolean>>({ Classes: true, Study: true, Personal: true, Exams: true, Deadlines: true })
  const [view, setView] = useState<"day" | "week" | "month" | "agenda">("week")
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [form, setForm] = useState<Omit<ScheduleEvent, "id">>({ 
    title: "", 
    date: selectedDate, 
    start: "09:00", 
    end: "10:00", 
    category: "Study", 
    location: "", 
    notes: "", 
    priority: "medium", 
    reminder: false 
  })

  useEffect(() => {
    if (!user) return
    
    const unsubscribe = subscribeToScheduleEvents(user.uid, (scheduleEvents) => {
      const formattedEvents = scheduleEvents.map(event => ({
        ...event,
        date: event.date?.toDate ? event.date.toDate() : new Date(event.date)
      }))
      setEvents(formattedEvents)
    })
    
    return unsubscribe
  }, [user])

  const filteredEvents = useMemo(
    () => events.filter((e) => filters[e.category] && (searchQuery === "" || e.title.toLowerCase().includes(searchQuery.toLowerCase()))),
    [events, filters, searchQuery],
  )

  const dayEvents = useMemo(
    () => filteredEvents.filter((e) => sameYMD(e.date, selectedDate)).sort((a, b) => a.start.localeCompare(b.start)),
    [filteredEvents, selectedDate],
  )

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [selectedDate])

  const weekMap = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {}
    weekDays.forEach((d) => {
      const key = format(d, "yyyy-MM-dd")
      map[key] = filteredEvents.filter((e) => sameYMD(e.date, d)).sort((a, b) => a.start.localeCompare(b.start))
    })
    return map
  }, [filteredEvents, weekDays])

  const agenda = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const d = a.date.getTime() - b.date.getTime()
      return d !== 0 ? d : a.start.localeCompare(b.start)
    })
  }, [filteredEvents])

  function toggleCategory(cat: Category) {
    setFilters((f) => ({ ...f, [cat]: !f[cat] }))
  }

  async function addEvent() {
    if (!form.title.trim() || !user) return
    
    try {
      await createScheduleEvent(user.uid, {
        title: form.title,
        date: form.date,
        start: form.start,
        end: form.end,
        category: form.category,
        location: form.location || "",
        notes: form.notes || "",
        priority: form.priority || "medium",
        reminder: form.reminder ? "true" : "false"
      })
      setOpenAdd(false)
      setSelectedDate(form.date)
      resetForm()
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const resetForm = () => {
    setForm({ 
      title: "", 
      date: selectedDate, 
      start: "09:00", 
      end: "10:00", 
      category: "Study", 
      location: "", 
      notes: "", 
      priority: "medium", 
      reminder: false 
    })
  }

  async function editEvent() {
    if (!form.title.trim() || !editingEvent) return
    
    try {
      await updateScheduleEvent(editingEvent.id, {
        title: form.title,
        date: form.date,
        start: form.start,
        end: form.end,
        category: form.category,
        location: form.location || "",
        notes: form.notes || "",
        priority: form.priority || "medium",
        reminder: form.reminder ? "true" : "false"
      })
      setOpenEdit(false)
      setEditingEvent(null)
      resetForm()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  async function deleteEvent(eventId: string) {
    try {
      await deleteScheduleEvent(eventId)
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  function startEdit(event: ScheduleEvent) {
    setEditingEvent(event)
    setForm({
      title: event.title,
      date: event.date,
      start: event.start,
      end: event.end,
      category: event.category,
      location: event.location || "",
      notes: event.notes || "",
      priority: event.priority || "medium",
      reminder: event.reminder || false,
    })
    setOpenEdit(true)
  }

  function goToday() {
    setSelectedDate(new Date())
  }

  function goPrev() {
    if (view === "day") setSelectedDate((d) => subDays(d, 1))
    else if (view === "week") setSelectedDate((d) => subWeeks(d, 1))
    else if (view === "month") setSelectedDate((d) => subMonths(d, 1))
    else setSelectedDate((d) => subDays(d, 7))
  }

  function goNext() {
    if (view === "day") setSelectedDate((d) => addDays(d, 1))
    else if (view === "week") setSelectedDate((d) => addWeeks(d, 1))
    else if (view === "month") setSelectedDate((d) => addMonths(d, 1))
    else setSelectedDate((d) => addDays(d, 7))
  }

  if (!user) {
    return <ProtectedRoute><div>Loading...</div></ProtectedRoute>
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E1] via-[#F5F0E1] to-[#E6E6FA]/30">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#F5F0E1]/95 via-[#F5F0E1]/95 to-[#E6E6FA]/30 backdrop-blur-xl border-b border-[#D2B48C]/20 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-white/30 hover:bg-white/40 text-slate-800 border-white/40 backdrop-blur-sm"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="text-left">
                <h1 className="font-heading text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#C1E1C1] via-[#ADD8E6] to-[#E6E6FA] bg-clip-text text-transparent drop-shadow-sm">
                  Your Perfect Schedule
                </h1>
                <p className="text-slate-600 font-medium mt-1">Master your time, achieve your goals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full md:w-64 bg-white/80 backdrop-blur-sm border-[#D2B48C]/30 focus:ring-[#C1E1C1]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList className="bg-white/80 backdrop-blur-sm border border-[#D2B48C]/20 shadow-lg">
                  <TabsTrigger value="day" className="data-[state=active]:bg-[#C1E1C1]">Day</TabsTrigger>
                  <TabsTrigger value="week" className="data-[state=active]:bg-[#C1E1C1]">Week</TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-[#C1E1C1]">Month</TabsTrigger>
                  <TabsTrigger value="agenda" className="data-[state=active]:bg-[#C1E1C1]">Agenda</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white/70 border border-[#D2B48C]/30 rounded-lg p-1 shadow-sm">
                <Button size="sm" variant="ghost" onClick={goPrev} className="text-slate-700">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="px-2 text-sm text-slate-700 min-w-[160px] text-center">
                  {view === "day" && format(selectedDate, "EEE, PPP")}
                  {view === "week" && `${format(weekDays[0], "MMM d")} – ${format(weekDays[6], "MMM d, yyyy")}`}
                  {view === "month" && format(selectedDate, "MMMM yyyy")}
                  {view === "agenda" && `Next ${agenda.length} items`}
                </div>
                <Button size="sm" variant="ghost" onClick={goNext} className="text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="h-5 w-px bg-[#D2B48C]/30 mx-1" />
                <Button size="sm" onClick={goToday} className="bg-[#C1E1C1] text-gray-800">Today</Button>
              </div>

              <span className="mr-2 inline-flex items-center gap-1 text-sm text-slate-600 font-medium">
                <Filter className="size-4" /> Filters
              </span>
              {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
                <Badge
                  key={cat}
                  className={`cursor-pointer ${filters[cat] ? `${CATEGORY_META[cat].color} text-white` : "border-[#D2B48C] bg-white"}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}

              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button className="ml-2 bg-[#C1E1C1] text-gray-800">
                    <Plus className="mr-2 size-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-xl border-[#D2B48C]/30">
                  <DialogHeader>
                    <DialogTitle className="text-slate-700 text-xl">Create New Event</DialogTitle>
                  </DialogHeader>
                  <CreateEventForm form={form} setForm={setForm} onSubmit={addEvent} onCancel={() => setOpenAdd(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="bg-white/95 backdrop-blur-xl border-[#D2B48C]/30">
                  <DialogHeader>
                    <DialogTitle className="text-slate-700 text-xl">Edit Event</DialogTitle>
                  </DialogHeader>
                  <CreateEventForm form={form} setForm={setForm} onSubmit={editEvent} onCancel={() => setOpenEdit(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="font-medium mr-1">Legend:</span>
            {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
              <span key={cat} className="inline-flex items-center gap-2">
                <span className={`inline-block size-3 rounded-full ${CATEGORY_META[cat].color}`} />
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
              <TabsContent value="day" className="space-y-4">
                <DayView 
                  selectedDate={selectedDate} 
                  events={filteredEvents} 
                  onEventClick={(event) => startEdit(event)}
                />
              </TabsContent>

              <TabsContent value="week">
                <div className="grid gap-4 md:grid-cols-7">
                  {weekDays.map((d) => {
                    const key = format(d, "yyyy-MM-dd")
                    const list = weekMap[key]
                    return (
                      <Card key={key} className={`overflow-hidden bg-white/80 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold flex items-center justify-between text-slate-700">
                            <span>{format(d, "EEE d")}</span>
                            {isToday(d) && <span className="text-xs text-[#FFCC99] font-bold">Today</span>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {list.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-4">Free day</p>
                          ) : (
                            list.map((e) => (
                              <div key={e.id} className={`rounded-xl p-3 text-sm ${CATEGORY_META[e.category].tone} border border-white/40`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate text-slate-700">{e.title}</span>
                                  <span className="text-xs text-slate-500 ml-1">{e.start}</span>
                                </div>
                                {e.location && (
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin className="size-3" /> {e.location}
                                  </p>
                                )}
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="month">
                <Card className="bg-white/80 backdrop-blur-sm border-[#D2B48C]/20 shadow-xl">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center font-semibold text-slate-600 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const monthStart = startOfMonth(selectedDate)
                        const monthEnd = endOfMonth(selectedDate)
                        const calendarStart = startOfWeek(monthStart)
                        const calendarEnd = addDays(startOfWeek(monthEnd), 6)
                        const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
                        
                        return calendarDays.map((day) => {
                          const dayEvents = filteredEvents.filter(e => isSameDay(e.date, day))
                          const isCurrentMonth = isSameMonth(day, selectedDate)
                          const isSelected = isSameDay(day, selectedDate)
                          const isToday = isSameDay(day, new Date())
                          
                          return (
                            <div
                              key={day.toISOString()}
                              onClick={() => setSelectedDate(day)}
                              className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                isSelected ? 'bg-[#C1E1C1]/20 border-[#C1E1C1]' :
                                isToday ? 'bg-[#ADD8E6]/20 border-[#ADD8E6]' :
                                isCurrentMonth ? 'bg-white border-[#D2B48C]/20 hover:bg-[#F5F0E1]/50' :
                                'bg-gray-50 border-gray-200 text-gray-400'
                              }`}
                            >
                              <div className={`text-sm font-medium mb-2 ${
                                isToday ? 'text-[#ADD8E6] font-bold' :
                                isCurrentMonth ? 'text-slate-700' : 'text-gray-400'
                              }`}>
                                {format(day, 'd')}
                              </div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                  <div
                                    key={event.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      startEdit(event)
                                    }}
                                    className={`text-xs p-1 rounded truncate ${CATEGORY_META[event.category].tone} border border-white/50 hover:shadow-sm transition-all`}
                                  >
                                    <div className="flex items-center gap-1">
                                      <span className={`w-2 h-2 rounded-full ${CATEGORY_META[event.category].color} flex-shrink-0`} />
                                      <span className="truncate font-medium">{event.title}</span>
                                    </div>
                                    <div className="text-slate-500 mt-0.5">{event.start}</div>
                                  </div>
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="text-xs text-slate-500 font-medium">
                                    +{dayEvents.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agenda">
                <Card className="bg-white/80 backdrop-blur-sm border-[#D2B48C]/20 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-700 flex items-center gap-3 text-xl">
                      <TrendingUp className="size-6" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {agenda.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto bg-[#C1E1C1] rounded-full flex items-center justify-center mb-4">
                          <List className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-slate-500 text-lg">No upcoming events</p>
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {agenda.map((e) => (
                          <li key={e.id} className="group flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-[#D2B48C]/20 transition-all duration-200">
                            <div className="flex min-w-0 items-center gap-4">
                              <span className={`inline-block size-4 shrink-0 rounded-full ${CATEGORY_META[e.category].color}`} />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-700">{e.title}</p>
                                <p className="truncate text-sm text-slate-500">
                                  {format(e.date, "PPP")} • {e.start} – {e.end}
                                  {e.location ? ` • ${e.location}` : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {e.reminder && <Bell className="size-4 text-[#FFCC99]" />}
                              <Badge variant="outline" className="bg-white/70">{e.category}</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-[#D2B48C]/30">
                                  <DropdownMenuItem onClick={() => startEdit(e)} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteEvent(e.id)} 
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Productivity Analytics Section */}
            <div className="mt-12 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#C1E1C1] via-[#ADD8E6] to-[#E6E6FA] bg-clip-text text-transparent mb-2">
                  Your Productivity Insights
                </h2>
                <p className="text-slate-600 text-lg">Track your progress and optimize your schedule</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Today's Focus */}
                <Card className="bg-gradient-to-br from-[#C1E1C1]/20 to-[#C1E1C1]/5 border-[#C1E1C1]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#C1E1C1] rounded-full">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-[#C1E1C1] text-white">Today</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-1">{dayEvents.length}</h3>
                    <p className="text-slate-600 text-sm">Events Scheduled</p>
                    <div className="mt-3 flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {dayEvents.length > 0 ? `${dayEvents.reduce((acc, e) => {
                        const start = parseInt(e.start.split(':')[0]) * 60 + parseInt(e.start.split(':')[1]);
                        const end = parseInt(e.end.split(':')[0]) * 60 + parseInt(e.end.split(':')[1]);
                        return acc + (end - start);
                      }, 0)} min total` : 'Free day'}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Overview */}
                <Card className="bg-gradient-to-br from-[#ADD8E6]/20 to-[#ADD8E6]/5 border-[#ADD8E6]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#ADD8E6] rounded-full">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-[#ADD8E6] text-white">This Week</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-1">{filteredEvents.filter(e => {
                      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                      const weekEnd = addDays(weekStart, 6);
                      return e.date >= weekStart && e.date <= weekEnd;
                    }).length}</h3>
                    <p className="text-slate-600 text-sm">Total Events</p>
                    <div className="mt-3 flex items-center text-xs text-slate-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round((filteredEvents.filter(e => {
                        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                        const weekEnd = addDays(weekStart, 6);
                        return e.date >= weekStart && e.date <= weekEnd;
                      }).length / 7) * 10) / 10} events/day avg
                    </div>
                  </CardContent>
                </Card>

                {/* Study Time */}
                <Card className="bg-gradient-to-br from-[#E6E6FA]/20 to-[#E6E6FA]/5 border-[#E6E6FA]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#E6E6FA] rounded-full">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-[#E6E6FA] text-slate-700">Study</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-1">
                      {filteredEvents.filter(e => e.category === 'Study').length}
                    </h3>
                    <p className="text-slate-600 text-sm">Study Sessions</p>
                    <div className="mt-3 flex items-center text-xs text-slate-500">
                      <Timer className="h-3 w-3 mr-1" />
                      {filteredEvents.filter(e => e.category === 'Study').length > 0 ? 'Active learner' : 'Plan study time'}
                    </div>
                  </CardContent>
                </Card>

                {/* Priority Tasks */}
                <Card className="bg-gradient-to-br from-[#FFCC99]/20 to-[#FFCC99]/5 border-[#FFCC99]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#FFCC99] rounded-full">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-[#FFCC99] text-white">High Priority</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-1">
                      {filteredEvents.filter(e => e.priority === 'high').length}
                    </h3>
                    <p className="text-slate-600 text-sm">Urgent Tasks</p>
                    <div className="mt-3 flex items-center text-xs text-slate-500">
                      <Zap className="h-3 w-3 mr-1" />
                      {filteredEvents.filter(e => e.priority === 'high').length > 0 ? 'Focus needed' : 'All caught up!'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              

              <div className="flex justify-center">
                <Button 
                  onClick={() => setOpenAdd(true)}
                  className="bg-gradient-to-r from-[#C1E1C1] to-[#ADD8E6] text-gray-800 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Add New Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#D2B48C]/20 p-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex bg-[#C1E1C1]/10 rounded-xl p-1 flex-1 mr-4">
            {(["day", "week", "month", "agenda"] as const).map((viewType) => (
              <Button 
                key={viewType} 
                variant="ghost" 
                size="sm" 
                onClick={() => setView(viewType)} 
                className={`text-xs px-3 py-2 rounded-lg flex-1 transition-all duration-200 ${view === viewType ? "bg-[#C1E1C1] text-white shadow-md" : "text-slate-600 hover:bg-white/50"}`}
              >
                {viewType.charAt(0).toUpperCase()}
              </Button>
            ))}
          </div>
          <Button 
            onClick={() => setOpenAdd(true)} 
            className="bg-gradient-to-r from-[#C1E1C1] to-[#ADD8E6] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}




