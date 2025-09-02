"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useAuth } from "../../contexts/AuthContext"
import { subscribeToTasks, createTask, updateTask, deleteTask } from "../../services/tasks"
import ProtectedRoute from "../../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { DatePicker } from "@/components/DatePicker"
import {
  Plus,
  Search,
  CalendarIcon,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  Trophy,
  Target,
  BarChart3,
  PieChart,
  Home,
  Filter,
  SortAsc,
  MoreVertical,
  Star,
  AlertTriangle,
  CheckSquare,
  Square,
  Timer,
  BookOpen,
  Users,
  Zap,
} from "lucide-react"

interface Task {
  id?: string
  title: string
  description: string
  dueDate: any
  priority: "high" | "medium" | "low"
  category: "study" | "personal" | "extracurricular"
  status: "todo" | "in_progress" | "done"
  progress: number
  createdAt: any
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete Biology Assignment",
    description: "Research and write about cellular respiration",
    dueDate: "2024-01-20",
    priority: "high",
    category: "study",
    status: "todo",
    progress: 0,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Math Problem Set 5",
    description: "Solve calculus problems 1-20",
    dueDate: "2024-01-18",
    priority: "medium",
    category: "study",
    status: "inprogress",
    progress: 60,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Gym Workout",
    description: "Upper body strength training",
    dueDate: "2024-01-16",
    priority: "low",
    category: "personal",
    status: "completed",
    progress: 100,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Club Meeting Preparation",
    description: "Prepare presentation for student council",
    dueDate: "2024-01-22",
    priority: "medium",
    category: "extracurricular",
    status: "todo",
    progress: 25,
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    title: "Physics Lab Report",
    description: "Complete analysis of pendulum experiment",
    dueDate: "2024-01-19",
    priority: "high",
    category: "study",
    status: "inprogress",
    progress: 40,
    createdAt: "2024-01-16",
  },
  {
    id: "6",
    title: "Volunteer at Food Bank",
    description: "Help organize donations and serve meals",
    dueDate: "2024-01-21",
    priority: "low",
    category: "extracurricular",
    status: "todo",
    progress: 0,
    createdAt: "2024-01-17",
  },
]

const TaskManagement = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [showFilters, setShowFilters] = useState(false)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as const,
    category: "study" as const,
    progress: 0,
  })

  // Subscribe to Firebase tasks
  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToTasks(user.uid, setTasks)
    return unsubscribe
  }, [user])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    inprogress: filteredTasks.filter((task) => task.status === "in_progress"),
    completed: filteredTasks.filter((task) => task.status === "done"),
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#FFCC99] text-gray-800 border-[#FFCC99]"
      case "medium":
        return "bg-[#C1E1C1] text-gray-800 border-[#C1E1C1]"
      case "low":
        return "bg-[#ADD8E6] text-gray-800 border-[#ADD8E6]"
      default:
        return "bg-gray-200 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-[#E6E6FA] text-gray-800 border-[#E6E6FA]"
      case "personal":
        return "bg-[#ADD8E6] text-gray-800 border-[#ADD8E6]"
      case "extracurricular":
        return "bg-[#C1E1C1] text-gray-800 border-[#C1E1C1]"
      default:
        return "bg-gray-200 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "study":
        return <BookOpen className="w-3 h-3" />
      case "personal":
        return <Timer className="w-3 h-3" />
      case "extracurricular":
        return <Users className="w-3 h-3" />
      default:
        return <Target className="w-3 h-3" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-3 h-3" />
      case "medium":
        return <Flag className="w-3 h-3" />
      case "low":
        return <Circle className="w-3 h-3" />
      default:
        return <Flag className="w-3 h-3" />
    }
  }

  const dateCache = useMemo(() => new Map<string, Date>(), [])
  
  const getDateFromCache = (dateString: string) => {
    if (!dateCache.has(dateString)) {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`)
        return new Date()
      }
      dateCache.set(dateString, date)
    }
    return dateCache.get(dateString)!
  }

  const isOverdue = (dueDate: string, status: string) => {
    try {
      return getDateFromCache(dueDate) < new Date() && status !== "completed"
    } catch {
      return false
    }
  }

  const getDaysUntilDue = (dueDate: any) => {
    try {
      const today = new Date()
      const due = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate)
      const diffTime = due.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return 0
    }
  }

  const handleAddTask = async () => {
    if (!user || !newTask.title || !newTask.dueDate) return
    try {
      await createTask(user.uid, {
        ...newTask,
        dueDate: new Date(newTask.dueDate),
        status: "todo",
        progress: newTask.progress
      })
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        category: "study",
        progress: 0,
      })
      setIsAddTaskOpen(false)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = async () => {
    if (!editingTask?.id) return
    try {
      await updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: new Date(editingTask.dueDate),
        priority: editingTask.priority,
        category: editingTask.category,
        status: editingTask.status,
        progress: editingTask.progress
      })
      setEditingTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const moveTask = async (taskId: string, newStatus: "todo" | "in_progress" | "done") => {
    try {
      const updates: any = { status: newStatus }
      if (newStatus === "done") {
        updates.progress = 100
      }
      await updateTask(taskId, updates)
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    try {
      await updateTask(taskId, {
        status: task.status === "done" ? "todo" : "done",
        progress: task.status === "done" ? 0 : 100
      })
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const markAllCompleted = async () => {
    try {
      await Promise.all(tasks.map(task => 
        updateTask(task.id!, { status: "done", progress: 100 })
      ))
    } catch (error) {
      console.error('Error marking all completed:', error)
    }
  }

  const clearCompleted = async () => {
    try {
      const completedTasks = tasks.filter(task => task.status === "done")
      await Promise.all(completedTasks.map(task => deleteTask(task.id!)))
    } catch (error) {
      console.error('Error clearing completed:', error)
    }
  }

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0
  const overdueTasks = tasks.filter((t) => {
    const dueDate = t.dueDate?.toDate ? t.dueDate.toDate() : new Date(t.dueDate)
    return dueDate < new Date() && t.status !== "done"
  }).length

  const TaskCard = ({ task }: { task: Task }) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate)
    const taskDueDate = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate)
    const isTaskOverdue = taskDueDate < new Date() && task.status !== "done"
    
    return (
      <Card className={`mb-4 border-[#D2B48C] hover:shadow-lg transition-all duration-300 cursor-move group ${
        isTaskOverdue ? 'ring-2 ring-[#FFCC99] bg-[#FFCC99]/5' : ''
      } ${task.status === 'done' ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with Checkbox */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTaskCompletion(task.id!)}
                className="mt-1 flex-shrink-0"
              >
                {task.status === "done" ? (
                  <CheckSquare className="w-5 h-5 text-[#C1E1C1]" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 hover:text-[#C1E1C1] transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold group-hover:text-[#C1E1C1] transition-colors ${
                  task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{task.description}</p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTask(task)}
                  className="h-8 w-8 p-0 hover:bg-[#C1E1C1] hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id!)}
                  className="h-8 w-8 p-0 hover:bg-[#FFCC99] hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`${getPriorityColor(task.priority)} flex items-center gap-1`}>
                {getPriorityIcon(task.priority)}
                {task.priority}
              </Badge>
              <Badge className={`${getCategoryColor(task.category)} flex items-center gap-1`}>
                {getCategoryIcon(task.category)}
                {task.category}
              </Badge>
              {isTaskOverdue && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>

            {/* Progress */}
            {task.progress > 0 && task.status !== "done" && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}

            {/* Due Date with urgency indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="w-3 h-3 mr-1" />
                <span className={isTaskOverdue ? "text-[#FFCC99] font-medium" : ""}>
                  Due: {(task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate)).toLocaleDateString()}
                </span>
              </div>
              {!isTaskOverdue && daysUntilDue <= 3 && daysUntilDue >= 0 && (
                <Badge className="bg-[#FFCC99] text-gray-800 text-xs">
                  {daysUntilDue === 0 ? 'Today' : `${daysUntilDue}d left`}
                </Badge>
              )}
            </div>

            {/* Status Actions */}
            {task.status !== "done" && (
              <div className="flex gap-2 pt-2">
                {task.status !== "todo" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTask(task.id!, "todo")}
                    className="text-xs border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-white"
                  >
                    <Circle className="w-3 h-3 mr-1" />
                    To Do
                  </Button>
                )}
                {task.status !== "in_progress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTask(task.id!, "in_progress")}
                    className="text-xs border-[#FFCC99] text-[#FFCC99] hover:bg-[#FFCC99] hover:text-white"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    In Progress
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveTask(task.id!, "done")}
                  className="text-xs border-[#C1E1C1] text-[#C1E1C1] hover:bg-[#C1E1C1] hover:text-white"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Complete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F5F0E1]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#D2B48C] to-[#C1E1C1] shadow-lg border-b border-[#D2B48C]/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section - Dashboard Button + Title */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Task Management</h1>
              </div>
            </div>

            {/* Center Section - Search and Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-1 lg:max-w-2xl lg:mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-[#ADD8E6] focus:border-[#C1E1C1] shadow-sm"
                />
              </div>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white/90 border-[#ADD8E6] hover:bg-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Right Section - Add Task Button */}
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F5F0E1] border-[#D2B48C] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                    />
                  </div>
                  <div>
                    <DatePicker
                      label="Due Date"
                      value={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                      onChange={(date) => {
                        if (date) {
                          setNewTask({ ...newTask, dueDate: format(date, "yyyy-MM-dd") })
                        }
                      }}
                      placeholder="Pick a date"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger className="h-12 border-[#ADD8E6] focus:border-[#C1E1C1] bg-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Category</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value: any) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger className="h-12 border-[#ADD8E6] focus:border-[#C1E1C1] bg-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="extracurricular">Extracurricular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddTask}
                      className="flex-1 bg-[#C1E1C1] hover:bg-[#FFCC99] text-white"
                      disabled={!newTask.title || !newTask.dueDate}
                    >
                      Create Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddTaskOpen(false)}
                      className="border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-[#D2B48C]/20 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-white border-[#ADD8E6]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="extracurricular">Extracurricular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="bg-white border-[#ADD8E6]">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white border-[#ADD8E6]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white border-[#ADD8E6]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Task Board */}
          <div className="flex-1">
            {/* Header with Stats and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
                <div className="flex gap-2">
                  <Badge className="bg-[#C1E1C1] text-gray-800">
                    {tasks.length} Total
                  </Badge>
                  <Badge className="bg-[#FFCC99] text-gray-800">
                    {overdueTasks} Overdue
                  </Badge>
                  <Badge className="bg-[#ADD8E6] text-gray-800">
                    {completionRate}% Complete
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllCompleted}
                  className="border-[#C1E1C1] text-[#C1E1C1] hover:bg-[#C1E1C1] hover:text-white"
                >
                  <CheckSquare className="w-4 h-4 mr-1" />
                  Mark All Done
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  className="border-[#FFCC99] text-[#FFCC99] hover:bg-[#FFCC99] hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear Done
                </Button>
                <div className="flex border border-[#ADD8E6] rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "kanban" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className={viewMode === "kanban" ? "bg-[#C1E1C1] text-white" : "text-[#ADD8E6] hover:bg-[#ADD8E6]/10"}
                  >
                    Kanban
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-[#C1E1C1] text-white" : "text-[#ADD8E6] hover:bg-[#ADD8E6]/10"}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            {viewMode === "kanban" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* To Do Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#ADD8E6]/20 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Circle className="w-4 h-4 mr-2 text-[#ADD8E6]" />
                      To Do
                    </h3>
                    <Badge className="bg-[#ADD8E6] text-gray-800">
                      {tasksByStatus.todo.length}
                    </Badge>
                  </div>
                  <div className="min-h-[500px] bg-[#ADD8E6]/5 rounded-lg p-4 border-2 border-dashed border-[#ADD8E6]/20">
                    {tasksByStatus.todo.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {tasksByStatus.todo.length === 0 && (
                      <div className="text-center text-gray-500 py-12">
                        <Circle className="w-16 h-16 mx-auto mb-4 text-[#ADD8E6]" />
                        <p className="text-lg font-medium">No tasks to do</p>
                        <p className="text-sm">Add a new task to get started!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#FFCC99]/20 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[#FFCC99]" />
                      In Progress
                    </h3>
                    <Badge className="bg-[#FFCC99] text-gray-800">
                      {tasksByStatus.inprogress.length}
                    </Badge>
                  </div>
                  <div className="min-h-[500px] bg-[#FFCC99]/5 rounded-lg p-4 border-2 border-dashed border-[#FFCC99]/20">
                    {tasksByStatus.inprogress.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {tasksByStatus.inprogress.length === 0 && (
                      <div className="text-center text-gray-500 py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 text-[#FFCC99]" />
                        <p className="text-lg font-medium">No tasks in progress</p>
                        <p className="text-sm">Move tasks here to start working!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#C1E1C1]/20 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-[#C1E1C1]" />
                      Completed
                    </h3>
                    <Badge className="bg-[#C1E1C1] text-gray-800">
                      {tasksByStatus.completed.length}
                    </Badge>
                  </div>
                  <div className="min-h-[500px] bg-[#C1E1C1]/5 rounded-lg p-4 border-2 border-dashed border-[#C1E1C1]/20">
                    {tasksByStatus.completed.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {tasksByStatus.completed.length === 0 && (
                      <div className="text-center text-gray-500 py-12">
                        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#C1E1C1]" />
                        <p className="text-lg font-medium">No completed tasks</p>
                        <p className="text-sm">Complete tasks to see them here!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-16">
                    <Target className="w-20 h-20 mx-auto mb-6 text-[#ADD8E6]" />
                    <p className="text-xl font-medium mb-2">No tasks found</p>
                    <p className="text-sm mb-4">Try adjusting your search or filters</p>
                    <Button
                      onClick={() => setIsAddTaskOpen(true)}
                      className="bg-[#C1E1C1] hover:bg-[#FFCC99] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Task
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="xl:w-80 space-y-6">
            {/* Quick Stats */}
            <Card className="border-[#D2B48C] bg-gradient-to-br from-[#E6E6FA]/40 to-[#ADD8E6]/20">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#C1E1C1]" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#C1E1C1] mb-1">{completionRate}%</div>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                  <Progress value={completionRate} className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
                    <p className="text-xs text-gray-600">Total Tasks</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-[#FFCC99]">{overdueTasks}</div>
                    <p className="text-xs text-gray-600">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Breakdown */}
            <Card className="border-[#D2B48C] bg-gradient-to-br from-[#FFCC99]/20 to-[#C1E1C1]/20">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-[#FFCC99]" />
                  Task Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#E6E6FA]" />
                      <span className="text-sm text-gray-600">Study Tasks</span>
                    </div>
                    <Badge className="bg-[#E6E6FA] text-gray-800">
                      {tasks.filter((t) => t.category === "study").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-[#ADD8E6]" />
                      <span className="text-sm text-gray-600">Personal Tasks</span>
                    </div>
                    <Badge className="bg-[#ADD8E6] text-gray-800">
                      {tasks.filter((t) => t.category === "personal").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C1E1C1]" />
                      <span className="text-sm text-gray-600">Extracurricular</span>
                    </div>
                    <Badge className="bg-[#C1E1C1] text-gray-800">
                      {tasks.filter((t) => t.category === "extracurricular").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Overview */}
            <Card className="border-[#D2B48C] bg-gradient-to-br from-[#C1E1C1]/20 to-[#FFCC99]/20">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-[#C1E1C1]" />
                  Priority Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#FFCC99]" />
                      <span className="text-sm text-gray-600">High Priority</span>
                    </div>
                    <Badge className="bg-[#FFCC99] text-gray-800">
                      {tasks.filter((t) => t.priority === "high").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-[#C1E1C1]" />
                      <span className="text-sm text-gray-600">Medium Priority</span>
                    </div>
                    <Badge className="bg-[#C1E1C1] text-gray-800">
                      {tasks.filter((t) => t.priority === "medium").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-[#ADD8E6]" />
                      <span className="text-sm text-gray-600">Low Priority</span>
                    </div>
                    <Badge className="bg-[#ADD8E6] text-gray-800">
                      {tasks.filter((t) => t.priority === "low").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-[#D2B48C] bg-gradient-to-br from-[#FFCC99]/20 to-[#E6E6FA]/20">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-[#FFCC99]" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 bg-[#C1E1C1] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Task Master</p>
                    <p className="text-xs text-gray-600">Complete 10 tasks</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="bg-[#C1E1C1] h-1.5 rounded-full" style={{ width: `${Math.max(0, Math.min(100, (tasks.filter(t => t.status === 'done').length / 10) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 bg-[#FFCC99] rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Streak Keeper</p>
                    <p className="text-xs text-gray-600">7-day completion streak</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="bg-[#FFCC99] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-[#F5F0E1] border-[#D2B48C] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#C1E1C1]" />
                Edit Task
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: any) => setEditingTask({ ...editingTask, priority: value })}
                  >
                    <SelectTrigger className="border-[#ADD8E6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingTask.category}
                    onValueChange={(value: any) => setEditingTask({ ...editingTask, category: value })}
                  >
                    <SelectTrigger className="border-[#ADD8E6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="extracurricular">Extracurricular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                />
              </div>
              <div>
                <Label htmlFor="edit-progress">Progress ({editingTask.progress}%)</Label>
                <div className="space-y-2">
                  <Input
                    id="edit-progress"
                    type="range"
                    min="0"
                    max="100"
                    value={editingTask.progress}
                    onChange={(e) => setEditingTask({ ...editingTask, progress: Number.parseInt(e.target.value) })}
                    className="border-[#ADD8E6] focus:border-[#C1E1C1]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateTask} className="flex-1 bg-[#C1E1C1] hover:bg-[#FFCC99] text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Update Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                  className="border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-[#C1E1C1] hover:bg-[#FFCC99] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      </div>
    </ProtectedRoute>
  )
}

export default TaskManagement


