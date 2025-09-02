"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToAssignments, createAssignment, updateAssignment, deleteAssignment } from '../../services/assignments'
import ProtectedRoute from '../../components/ProtectedRoute'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  House,
  Paperclip,
  CheckCircle2,
  NotebookPen,
  X,
} from "lucide-react"

import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

// Dynamic import for DnD components to prevent hydration issues
const DndProvider = dynamic(
  () => import("@dnd-kit/core").then((mod) => ({ default: mod.DndContext })),
  { ssr: false }
)

// Types
interface Assignment {
  id: string
  title: string
  subject: string
  due: string // ISO date
  status: StatusKey
  progress: number // 0-100
  grade?: number // 0-100
  notes?: string
  files?: number
}

type StatusKey = "not_started" | "in_progress" | "done" | "graded"

const STATUSES: Record<StatusKey, { label: string }> = {
  not_started: { label: "Not Started" },
  in_progress: { label: "In Progress" },
  done: { label: "Done" },
  graded: { label: "Graded" },
}

// Removed fixed subjects list; subjects are now free-text provided by the user



// Draggable item
function DraggableCard({ assignment, isDndEnabled = true }: { assignment: Assignment; isDndEnabled?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ 
    id: assignment.id, 
    data: assignment,
    disabled: !isDndEnabled
  })
  const isOverdue = (() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(assignment.due)
    dueDate.setHours(0, 0, 0, 0)
    const isDone = assignment.status === "done" || assignment.status === "graded"
    return !isDone && dueDate.getTime() < today.getTime()
  })()
  return (
    <div
      ref={setNodeRef}
      {...(isDndEnabled ? { ...listeners, ...attributes } : {})}
      className={`rounded-lg border border-light-wood bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${isDndEnabled ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-medium leading-tight text-foreground">{assignment.title}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-light-wood bg-soft-beige text-foreground text-xs">
              {assignment.subject}
            </Badge>
            <div className={`inline-flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
              <Calendar className="size-3.5" /> {assignment.due?.toDate ? assignment.due.toDate().toLocaleDateString() : new Date(assignment.due).toLocaleDateString()}
            </div>
            {typeof assignment.grade === "number" && (
              <div className="inline-flex items-center gap-1 text-foreground">
                <CheckCircle2 className="size-3.5" /> {assignment.grade}%
              </div>
            )}
          </div>
        </div>
        <button className="rounded-md p-1 hover:bg-sky-blue/20" aria-label="More actions">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <div className="mt-3">
        <Progress value={assignment.progress} className="h-2" />
      </div>
      {assignment.files ? (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Paperclip className="size-3.5" /> {assignment.files} file{assignment.files > 1 ? "s" : ""}
        </div>
      ) : null}
    </div>
  )
}

// Droppable column
function KanbanColumn({ id, title, items, isDndEnabled = true }: { id: StatusKey; title: string; items: Assignment[]; isDndEnabled?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    disabled: !isDndEnabled
  })
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-lg border border-light-wood bg-white p-3 shadow-sm"
      ref={setNodeRef}
      style={{ outline: isOver && isDndEnabled ? "2px solid #C1E1C1" : undefined }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm tracking-tight text-foreground">
          {title} <span className="text-xs text-muted-foreground">({items.length})</span>
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {items.map((a) => (
          <DraggableCard key={a.id} assignment={a} isDndEnabled={isDndEnabled} />
        ))}
        {items.length === 0 && (
          <div className="rounded-md border border-dashed border-light-wood p-4 text-center text-xs text-muted-foreground">
            {isDndEnabled ? "Drop here" : "No assignments"}
          </div>
        )}
      </div>
    </div>
  )
}

// Detail form in a sheet
function AssignmentForm({ value, onSave }: { value?: Assignment; onSave: (a: Assignment) => void }) {
  const getInitialForm = () => ({
    id: Math.random().toString(36).slice(2),
    title: "",
    subject: "",
    due: new Date().toISOString().slice(0, 10),
    status: "not_started" as StatusKey,
    progress: 0,
    notes: "",
    files: 0,
  })
  
  const [form, setForm] = useState<Assignment>(() => value ?? getInitialForm())
  
  useEffect(() => {
    if (value) {
      setForm(value)
    } else {
      setForm(getInitialForm())
    }
  }, [value])
  
  const handleSave = () => {
    onSave(form)
    if (!value) {
      setForm(getInitialForm())
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Literature Review Draft"
          className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Subject</label>
          <Input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Enter subject (e.g., Geography, Art)"
            className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Due date</label>
          <Input 
            type="date" 
            value={form.due} 
            onChange={(e) => setForm({ ...form, due: e.target.value })}
            className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as StatusKey })}>
            <SelectTrigger className="bg-white border-light-wood">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-light-wood">
              {Object.entries(STATUSES).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Progress</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
            className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Grade (optional)</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={form.grade ?? ""}
            onChange={(e) => setForm({ ...form, grade: e.target.value === "" ? undefined : Number(e.target.value) })}
            className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Attachments</label>
          <Input
            type="number"
            min={0}
            value={form.files ?? 0}
            onChange={(e) => setForm({ ...form, files: Number(e.target.value) })}
            className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Notes</label>
        <Textarea
          rows={4}
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Key requirements, rubric, links..."
          className="bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" className="border-light-wood hover:bg-sky-blue/20" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default function Assignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToAssignments(user.uid, setAssignments)
    return unsubscribe
  }, [user])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusKey | "all">("all")
  const [sortBy, setSortBy] = useState<"due_asc" | "due_desc" | "progress_desc" | "title_asc">("due_asc")
  const [openSheet, setOpenSheet] = useState(false)
  const [editTarget, setEditTarget] = useState<Assignment | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Derived lists per column
  const filtered = useMemo(() => {
    const list = assignments.filter(
      (a) =>
        (statusFilter === "all" || a.status === statusFilter) &&
        (query.trim() === "" || a.title.toLowerCase().includes(query.toLowerCase())),
    )
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "due_asc") return a.due.localeCompare(b.due)
      if (sortBy === "due_desc") return b.due.localeCompare(a.due)
      if (sortBy === "progress_desc") return (b.progress ?? 0) - (a.progress ?? 0)
      if (sortBy === "title_asc") return a.title.localeCompare(b.title)
      return 0
    })
    return sorted
  }, [assignments, query, statusFilter, sortBy])

  const grouped: Record<StatusKey, Assignment[]> = useMemo(
    () => ({
      not_started: filtered.filter((a) => a.status === "not_started"),
      in_progress: filtered.filter((a) => a.status === "in_progress"),
      done: filtered.filter((a) => a.status === "done"),
      graded: filtered.filter((a) => a.status === "graded"),
    }),
    [filtered],
  )

  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({ particleCount: 60, spread: 60, origin: { y: 0.2 } })
      })
    }
  }

  // Handlers
  const upsertAssignment = async (a: Assignment) => {
    if (!user) return
    try {
      // Check if this is an existing assignment (has a real Firebase ID)
      const isExisting = a.id && assignments.some(existing => existing.id === a.id)
      
      if (isExisting) {
        await updateAssignment(a.id, {
          title: a.title,
          subject: a.subject,
          due: new Date(a.due),
          status: a.status,
          progress: a.progress,
          grade: a.grade,
          notes: a.notes,
          files: a.files
        })
      } else {
        await createAssignment(user.uid, {
          title: a.title,
          subject: a.subject,
          due: new Date(a.due),
          status: a.status,
          progress: a.progress,
          grade: a.grade || '',
          notes: a.notes || '',
          files: a.files || []
        })
      }
      if (a.status === "done" || a.status === "graded") {
        triggerConfetti()
      }
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    try {
      await deleteAssignment(id)
    } catch (error) {
      console.error('Error deleting assignment:', error)
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    
    const overCol = over.id as StatusKey
    const assignmentId = active.id as string
    
    // Find the assignment being moved
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) return
    
    // Calculate new progress based on status
    const newProgress = overCol === "not_started" ? 0 : 
                       overCol === "done" || overCol === "graded" ? 100 : 
                       assignment.progress
    
    try {
      // Update in Firebase
      await updateAssignment(assignmentId, {
        status: overCol,
        progress: newProgress
      })
      
      if (overCol === "done" || overCol === "graded") triggerConfetti()
    } catch (error) {
      console.error('Error updating assignment status:', error)
      // Optionally show user feedback here
    }
  }

  // Quick stats
  const { totalCount, dueTodayCount, overdueCount, completionRate } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const notGradedStatuses: StatusKey[] = ["not_started", "in_progress", "done"]
    const total = assignments.length
    const doneCount = assignments.filter((a) => a.status === "done" || a.status === "graded").length
    const completion = total === 0 ? 0 : Math.round((doneCount / total) * 100)
    const dueToday = assignments.filter((a) => {
      const d = new Date(a.due)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime()
    }).length
    const overdue = assignments.filter((a) => {
      const d = new Date(a.due)
      d.setHours(0, 0, 0, 0)
      return d.getTime() < today.getTime() && notGradedStatuses.includes(a.status)
    }).length
    return { totalCount: total, dueTodayCount: dueToday, overdueCount: overdue, completionRate: completion }
  }, [assignments])

  // Insights data (avg grades per subject)
  // removed average grade insights section

  const isOverdueDate = (a: Assignment) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = new Date(a.due)
    d.setHours(0, 0, 0, 0)
    const isDone = a.status === "done" || a.status === "graded"
    return !isDone && d.getTime() < today.getTime()
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-soft-beige px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] disabled:opacity-50 disabled:pointer-events-none bg-[#C1E1C1] text-gray-800 hover:bg-[#C1E1C1]/90 h-9 px-3 text-sm bg-white/30 hover:bg-white/40 text-slate-800 border-white/40 backdrop-blur-sm">
              <House className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assignments</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 bg-white border-light-wood focus:border-sky-blue focus:ring-sky-blue"
              placeholder="Search assignments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* Subject filter removed as requested */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[160px] bg-white border-light-wood">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-light-wood">
              <SelectItem value="all">All status</SelectItem>
              {Object.entries(STATUSES).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[170px] bg-white border-light-wood">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-white border-light-wood">
              <SelectItem value="due_asc">Due date ↑</SelectItem>
              <SelectItem value="due_desc">Due date ↓</SelectItem>
              <SelectItem value="progress_desc">Progress ↓</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button className="bg-green-plants text-white hover:bg-green-plants/90">
                <Plus className="mr-2 size-4" /> Assignment
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-lg">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>
                    <NotebookPen className="mr-2 inline size-4" /> {editTarget ? "Edit Assignment" : "New Assignment"}
                  </SheetTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenSheet(false)
                      setEditTarget(undefined)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <SheetDescription>Add details, due date, and progress.</SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <AssignmentForm
                  value={editTarget}
                  onSave={(a) => {
                    upsertAssignment(a)
                    setOpenSheet(false)
                    setEditTarget(undefined)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList className="bg-white border-light-wood">
          <TabsTrigger value="board" className="data-[state=active]:bg-green-plants data-[state=active]:text-foreground">Board</TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-green-plants data-[state=active]:text-foreground">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-light-wood bg-white p-8 text-center">
              <div className="mb-2 text-sm text-muted-foreground">No assignments found</div>
              <Button onClick={() => setOpenSheet(true)} className="bg-green-plants text-white hover:bg-green-plants/90">
                <Plus className="mr-2 size-4" /> Add your first assignment
              </Button>
            </div>
          ) : !isMounted ? (
            <div className="grid gap-4 md:grid-cols-4">
              <KanbanColumn id="not_started" title={STATUSES.not_started.label} items={grouped.not_started} isDndEnabled={false} />
              <KanbanColumn id="in_progress" title={STATUSES.in_progress.label} items={grouped.in_progress} isDndEnabled={false} />
              <KanbanColumn id="done" title={STATUSES.done.label} items={grouped.done} isDndEnabled={false} />
              <KanbanColumn id="graded" title={STATUSES.graded.label} items={grouped.graded} isDndEnabled={false} />
            </div>
          ) : (
            <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
              <div className="grid gap-4 md:grid-cols-4">
                <KanbanColumn id="not_started" title={STATUSES.not_started.label} items={grouped.not_started} isDndEnabled={true} />
                <KanbanColumn id="in_progress" title={STATUSES.in_progress.label} items={grouped.in_progress} isDndEnabled={true} />
                <KanbanColumn id="done" title={STATUSES.done.label} items={grouped.done} isDndEnabled={true} />
                <KanbanColumn id="graded" title={STATUSES.graded.label} items={grouped.graded} isDndEnabled={true} />
              </div>
            </DndContext>
          )}
          {/* Average grade per subject section removed */}
        </TabsContent>

        <TabsContent value="table">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-light-wood bg-white p-8 text-center">
              <div className="mb-2 text-sm text-muted-foreground">No assignments to show</div>
              <Button onClick={() => setOpenSheet(true)} className="bg-green-plants text-white hover:bg-green-plants/90">
                <Plus className="mr-2 size-4" /> Create assignment
              </Button>
            </div>
          ) : (
            <Card className="bg-white border-light-wood">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-light-wood">
                      <TableHead className="text-foreground">Title</TableHead>
                      <TableHead className="text-foreground">Subject</TableHead>
                      <TableHead className="text-foreground">Due</TableHead>
                      <TableHead className="text-foreground">Progress</TableHead>
                      <TableHead className="text-foreground">Files</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Grade</TableHead>
                      <TableHead className="text-right text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a) => (
                      <TableRow key={a.id} className="border-light-wood hover:bg-soft-beige/50">
                        <TableCell className="font-medium text-foreground">{a.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-light-wood bg-soft-beige text-foreground text-xs">
                            {a.subject}
                          </Badge>
                        </TableCell>
                        <TableCell className={`${isOverdueDate(a) ? 'text-red-600' : 'text-foreground'}`}>{a.due?.toDate ? a.due.toDate().toLocaleDateString() : new Date(a.due).toLocaleDateString()}</TableCell>
                        <TableCell className="w-[180px]">
                          <Progress value={a.progress} className="h-2" />
                        </TableCell>
                        <TableCell className="text-foreground">{a.files ?? 0}</TableCell>
                        <TableCell className="text-foreground">{STATUSES[a.status].label}</TableCell>
                        <TableCell className="text-foreground">{typeof a.grade === "number" ? `${a.grade}%` : "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-light-wood hover:bg-sky-blue/20"
                              onClick={() => {
                                setEditTarget(a)
                                setOpenSheet(true)
                              }}
                            >
                              <Edit className="mr-2 size-4" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteAssignment(a.id!)}>
                              <Trash2 className="mr-2 size-4" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats (moved to bottom) */}
      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="bg-white border-light-wood">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-foreground">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-light-wood">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Due Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-foreground">{dueTodayCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-light-wood">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-light-wood">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Completion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-foreground">{completionRate}%</div>
              <Progress value={completionRate} className="h-2 flex-1" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
    </ProtectedRoute>
  )
}