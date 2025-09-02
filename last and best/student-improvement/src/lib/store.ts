// Global state management for seamless integration across all pages
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category: 'study' | 'personal' | 'extracurricular'
  dueDate: string
  status?: 'todo' | 'inprogress' | 'completed'
  progress?: number
}

export interface Assignment {
  id: string
  title: string
  subject: string
  due: string
  progress: number
  status: 'todo' | 'in_progress' | 'done' | 'graded'
}

export interface Habit {
  id: string
  name: string
  streak: number
  completedToday: boolean
  category: string
}

export interface ScheduleEvent {
  id: string
  title: string
  date: Date
  start: string
  end: string
  category: string
}

export interface BudgetData {
  spent: number
  budget: number
  transactions: number
}

// Global store
class AppStore {
  private listeners: Set<() => void> = new Set()
  private updateInterval: NodeJS.Timeout | null = null
  
  data = {
    tasks: [] as Task[],
    assignments: [] as Assignment[],
    habits: [] as Habit[],
    events: [] as ScheduleEvent[],
    budget: { spent: 600, budget: 1000, transactions: 12 } as BudgetData,
    studySessions: 0,
    lastActivity: null as any,
    lastSync: new Date(),
    isOnline: true
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach(listener => listener())
  }

  updateTasks(tasks: Task[]) {
    this.data.tasks = tasks
    this.data.lastActivity = { type: 'task', time: new Date() }
    this.notify()
  }

  updateAssignments(assignments: Assignment[]) {
    this.data.assignments = assignments
    this.data.lastActivity = { type: 'assignment', time: new Date() }
    this.notify()
  }

  updateHabits(habits: Habit[]) {
    this.data.habits = habits
    this.data.lastActivity = { type: 'habit', time: new Date() }
    this.notify()
  }

  updateEvents(events: ScheduleEvent[]) {
    this.data.events = events
    this.data.lastActivity = { type: 'event', time: new Date() }
    this.notify()
  }

  updateBudget(budget: BudgetData) {
    this.data.budget = budget
    this.data.lastActivity = { type: 'budget', time: new Date() }
    this.notify()
  }

  completeStudySession() {
    this.data.studySessions++
    this.data.lastActivity = { type: 'study', time: new Date() }
    this.notify()
  }

  // Simulate real-time data sync
  startRealTimeSync() {
    if (this.updateInterval) return
    
    this.updateInterval = setInterval(() => {
      this.data.lastSync = new Date()
      
      // Simulate network status
      this.data.isOnline = Math.random() > 0.05 // 95% uptime
      
      // Auto-update progress on active tasks
      const activeTasks = this.data.tasks.filter(t => !t.completed && t.status === 'inprogress')
      if (activeTasks.length > 0 && Math.random() < 0.4) {
        const task = activeTasks[Math.floor(Math.random() * activeTasks.length)]
        if (task.progress !== undefined && task.progress < 100) {
          task.progress = Math.min(100, task.progress + Math.floor(Math.random() * 15))
          if (task.progress === 100) {
            task.completed = true
            task.status = 'completed'
          }
          this.data.lastActivity = { type: 'task', time: new Date() }
          this.notify()
        }
      }
      
      // Auto-update assignment progress
      const activeAssignments = this.data.assignments.filter(a => a.status === 'in_progress')
      if (activeAssignments.length > 0 && Math.random() < 0.3) {
        const assignment = activeAssignments[Math.floor(Math.random() * activeAssignments.length)]
        if (assignment.progress < 100) {
          assignment.progress = Math.min(100, assignment.progress + Math.floor(Math.random() * 10))
          if (assignment.progress === 100) {
            assignment.status = 'done'
          }
          this.data.lastActivity = { type: 'assignment', time: new Date() }
          this.notify()
        }
      }
      
      // Simulate small budget transactions
      if (Math.random() < 0.15) {
        const transaction = Math.floor(Math.random() * 25) + 5
        if (this.data.budget.spent + transaction <= this.data.budget.budget) {
          this.data.budget.spent += transaction
          this.data.budget.transactions += 1
          this.data.lastActivity = { type: 'budget', time: new Date() }
          this.notify()
        }
      }
    }, 20000) // Update every 20 seconds
  }

  stopRealTimeSync() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  // Force refresh all data
  refreshData() {
    this.data.lastSync = new Date()
    this.data.lastActivity = { type: 'refresh', time: new Date() }
    this.notify()
  }
}

export const store = new AppStore()