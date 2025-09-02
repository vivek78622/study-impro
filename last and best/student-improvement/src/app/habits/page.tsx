"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToHabits, createHabit, updateHabit, deleteHabit } from '../../services/habits'
import ProtectedRoute from '../../components/ProtectedRoute'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CheckCircle2, Circle, Filter, Search, Edit, Trash2, Trophy, Flame, Target, BookOpen, Dumbbell, Coffee, Moon, Heart, Brain, TrendingUp, Award, Star, Home } from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: string
  streak: number
  completedToday: boolean
  totalDays: number
  completedDays: number
  color: string
  icon: string
  createdAt: Date
  lastCompleted?: Date
}

const HabitsPage = () => {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])

  const [filteredHabits, setFilteredHabits] = useState<Habit[]>(habits)
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isEditHabitOpen, setIsEditHabitOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", description: "", category: "Study", frequency: "Daily", color: "bg-[#C1E1C1]", icon: "Target" })
  const [sortOption, setSortOption] = useState("Newest")

  const categories = ["All", "Study", "Personal", "Extracurricular"]
  const habitColors = ["bg-[#C1E1C1]", "bg-[#FFCC99]", "bg-[#ADD8E6]", "bg-[#E6E6FA]", "bg-[#D2B48C]"]

  const iconOptions = [
    { name: "Target", icon: Target },
    { name: "BookOpen", icon: BookOpen },
    { name: "Dumbbell", icon: Dumbbell },
    { name: "Coffee", icon: Coffee },
    { name: "Moon", icon: Moon },
    { name: "Heart", icon: Heart },
    { name: "Brain", icon: Brain },
  ]

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = { Target, BookOpen, Dumbbell, Coffee, Moon, Heart, Brain }
    const IconComponent = iconMap[iconName] || Target
    return <IconComponent className="w-5 h-5" />
  }

  const achievements = [
    { name: "First Step", description: "Complete your first habit", icon: Star, unlocked: true },
    { name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, unlocked: true },
    { name: "Consistency King", description: "Complete 30 habits", icon: Trophy, unlocked: false },
    { name: "Habit Master", description: "Maintain 5 habits for 30 days", icon: Award, unlocked: false },
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!user?.uid) return
    
    const unsubscribe = subscribeToHabits(user.uid, async (fetchedHabits) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const processedHabits = []
      const streakUpdates = []
      
      for (const h of fetchedHabits) {
        const lastCompleted = h.lastCompleted?.toDate ? h.lastCompleted.toDate() : null
        const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null
        
        // Check if habit was completed today
        const completedToday = lastCompletedDate && lastCompletedDate.getTime() === today.getTime()
        
        // Reset streak if more than 1 day gap (after 12 PM next day)
        let currentStreak = h.streak || 0
        if (lastCompletedDate && !completedToday) {
          const daysDiff = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysDiff > 1) {
            currentStreak = 0
            // Queue streak update to Firebase
            if (currentStreak !== h.streak) {
              streakUpdates.push(updateHabit(h.id, { streak: currentStreak, completedToday: false }))
            }
          }
        }
        
        processedHabits.push({
          ...h,
          createdAt: h.createdAt?.toDate ? h.createdAt.toDate() : new Date(),
          lastCompleted: lastCompleted,
          completedToday: completedToday || false,
          streak: currentStreak,
          totalDays: Math.max(1, Math.ceil((Date.now() - (h.createdAt?.toDate ? h.createdAt.toDate().getTime() : Date.now())) / (1000 * 60 * 60 * 24))),
          completedDays: h.completedDays || 0,
          color: h.color || "bg-[#C1E1C1]",
          icon: h.icon || "Target"
        })
      }
      
      // Execute all streak updates
      if (streakUpdates.length > 0) {
        await Promise.all(streakUpdates)
      }
      
      setHabits(processedHabits)
    })
    
    return unsubscribe
  }, [user?.uid])

  useEffect(() => {
    let filtered = habits
    if (searchTerm) {
      filtered = filtered.filter((habit) => habit.name.toLowerCase().includes(searchTerm.toLowerCase()) || habit.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (categoryFilter !== "All") {
      filtered = filtered.filter((habit) => habit.category === categoryFilter)
    }
    setFilteredHabits(filtered)
  }, [habits, searchTerm, categoryFilter])

  const toggleHabitCompletion = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null
    const lastCompletedDate = lastCompleted ? new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()) : null
    
    const wasCompleted = habit.completedToday
    let newStreak = habit.streak
    
    if (!wasCompleted) {
      // Completing habit
      if (!lastCompletedDate || lastCompletedDate.getTime() === today.getTime() - 86400000) {
        // First completion or completed yesterday - continue streak
        newStreak = habit.streak + 1
      } else if (lastCompletedDate.getTime() < today.getTime() - 86400000) {
        // Missed days - reset streak
        newStreak = 1
      } else {
        // Same day completion
        newStreak = Math.max(1, habit.streak)
      }
    } else {
      // Uncompleting habit
      if (lastCompletedDate && lastCompletedDate.getTime() === today.getTime()) {
        // Uncompleting today's completion
        newStreak = Math.max(0, habit.streak - 1)
      }
    }
    
    const newCompletedDays = wasCompleted ? Math.max(0, habit.completedDays - 1) : habit.completedDays + 1
    
    await updateHabit(habitId, {
      completedToday: !wasCompleted,
      streak: newStreak,
      completedDays: newCompletedDays,
      lastCompleted: !wasCompleted ? now : null
    })
  }

  const addHabit = async () => {
    if (!newHabit.name.trim() || !user?.uid) return
    
    try {
      await createHabit(user.uid, newHabit)
      setNewHabit({ name: "", description: "", category: "Study", frequency: "Daily", color: "bg-[#C1E1C1]", icon: "Target" })
      setIsAddHabitOpen(false)
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  const deleteHabitHandler = async (habitId: string) => {
    try {
      await deleteHabit(habitId)
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsEditHabitOpen(true)
  }

  const updateHabitHandler = async () => {
    if (!editingHabit) return
    
    try {
      await updateHabit(editingHabit.id, {
        name: editingHabit.name,
        description: editingHabit.description,
        category: editingHabit.category,
        frequency: editingHabit.frequency,
        color: editingHabit.color,
        icon: editingHabit.icon
      })
      setIsEditHabitOpen(false)
      setEditingHabit(null)
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.completedToday).length
  const averageStreak = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0
  const completionRate = habits.length > 0 ? Math.round((habits.reduce((sum, h) => sum + h.completedDays, 0) / habits.reduce((sum, h) => sum + h.totalDays, 0)) * 100) || 0 : 0
  const displayedHabits = [...filteredHabits].sort((a, b) => {
    switch (sortOption) {
      case "Oldest":
        return a.createdAt.getTime() - b.createdAt.getTime()
      case "Highest Streak":
        return b.streak - a.streak
      case "Name A-Z":
        return a.name.localeCompare(b.name)
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#F5F0E1]">
      {!isMounted ? null : (
      <>
      <header className="bg-gradient-to-br from-[#D2B48C] to-[#C1A36A] shadow-sm border-b border-[#D2B48C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <Link href="/dashboard" className="shrink-0">
                <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white my-1">Habit Tracking</h1>
                <p className="text-white/80">Build lasting habits for academic success</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search habits..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white border-white/20 w-full sm:w-64" />
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="bg-[#ADD8E6] border-[#ADD8E6] text-white w-full sm:w-44">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newest">Newest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                  <SelectItem value="Highest Streak">Highest Streak</SelectItem>
                  <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C1E1C1] hover:bg-[#FFCC99] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Habit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F5F0E1] border-[#D2B48C]">
                  <DialogHeader>
                    <DialogTitle className="text-[#D2B48C]">Create New Habit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Habit Name</Label>
                      <Input id="name" value={newHabit.name} onChange={(e) => setNewHabit((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g., Morning Reading" className="border-[#D2B48C]/30" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={newHabit.description} onChange={(e) => setNewHabit((prev) => ({ ...prev, description: e.target.value }))} placeholder="Brief description of your habit" className="border-[#D2B48C]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newHabit.category} onValueChange={(value) => setNewHabit((prev) => ({ ...prev, category: value }))}>
                          <SelectTrigger className="border-[#D2B48C]/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={newHabit.frequency} onValueChange={(value) => setNewHabit((prev) => ({ ...prev, frequency: value }))}>
                          <SelectTrigger className="border-[#D2B48C]/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Color Theme</Label>
                      <div className="flex gap-2 mt-2">
                        {habitColors.map((color) => (
                          <button key={color} className={`w-8 h-8 rounded-full ${color} border-2 ${newHabit.color === color ? "border-gray-800" : "border-gray-300"}`} onClick={() => setNewHabit((prev) => ({ ...prev, color }))} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {iconOptions.map(({ name, icon: Icon }) => (
                          <button key={name} className={`p-2 rounded-lg border-2 ${newHabit.icon === name ? "border-[#C1E1C1] bg-[#C1E1C1]/10" : "border-gray-300"}`} onClick={() => setNewHabit((prev) => ({ ...prev, icon: name }))}>
                            <Icon className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addHabit} className="bg-[#C1E1C1] hover:bg-[#FFCC99] text-white flex-1">Create Habit</Button>
                      <Button variant="outline" onClick={() => setIsAddHabitOpen(false)} className="border-[#D2B48C] text-[#D2B48C]">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#F5F0E1]/80 backdrop-blur supports-[backdrop-filter]:bg-[#F5F0E1]/60 border-b border-[#D2B48C]/20">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button key={c} className={`px-3 py-1 rounded-full text-sm border transition ${categoryFilter === c ? "bg-[#D2B48C] text-white border-[#D2B48C]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`} onClick={() => setCategoryFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-[#C1E1C1]">{completedToday}</div><div className="text-sm text-gray-600">Completed Today</div></CardContent></Card>
              <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-[#FFCC99]">{totalHabits}</div><div className="text-sm text-gray-600">Total Habits</div></CardContent></Card>
              <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-[#ADD8E6]">{averageStreak}</div><div className="text-sm text-gray-600">Avg Streak</div></CardContent></Card>
              <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-[#E6E6FA]">{completionRate}%</div><div className="text-sm text-gray-600">Success Rate</div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedHabits.map((habit) => (
                <Card key={habit.id} className="border-[#D2B48C]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-white/90">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${habit.color} rounded-xl flex items-center justify-center text-white`}>
                          {getIcon(habit.icon)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{habit.name}</h3>
                          <p className="text-sm text-gray-600">{habit.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-400" onClick={() => startEditHabit(habit)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => deleteHabitHandler(habit.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`${habit.color} text-white`}>{habit.category}</Badge>
                          <Badge variant="outline" className="border-gray-200 text-gray-600">{habit.frequency}</Badge>
                        </div>
                        <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#FFCC99]" /><span className="font-bold text-[#FFCC99]">{habit.streak} day streak</span></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Progress</span><span>{habit.completedDays}/{habit.totalDays} days</span></div>
                        <Progress value={habit.totalDays > 0 ? (habit.completedDays / habit.totalDays) * 100 : 0} className="h-2" />
                        <div className="text-xs text-gray-500">{habit.lastCompleted ? `Last done ${habit.lastCompleted.toLocaleDateString()}` : "Not completed yet"}</div>
                      </div>
                      <Button onClick={() => toggleHabitCompletion(habit.id)} className={`w-full ${habit.completedToday ? "bg-[#C1E1C1] hover:bg-[#C1E1C1]/80 text-white" : "bg-gray-100 hover:bg-[#C1E1C1] text-gray-600 hover:text-white"} transition-all duration-300`}>
                        {habit.completedToday ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Completed Today!</>) : (<><Circle className="w-4 h-4 mr-2" />Mark Complete</>)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHabits.length === 0 && (
              <Card className="border-dashed border-2 border-[#D2B48C]/40 bg-white/70">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-[#D2B48C] mx-auto mb-4 opacity-60" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No habits found</h3>
                  <p className="text-gray-600 mb-6">{searchTerm || categoryFilter !== "All" ? "Try adjusting your search or filter criteria" : "Start building better habits today!"}</p>
                  {!searchTerm && categoryFilter === "All" && (
                    <Button onClick={() => setIsAddHabitOpen(true)} className="bg-[#C1E1C1] hover:bg-[#FFCC99] text-white"><Plus className="w-4 h-4 mr-2" />Create Your First Habit</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#D2B48C] flex items-center gap-2"><TrendingUp className="w-5 h-5" />Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center"><div className="text-3xl font-bold text-[#C1E1C1]">{completedToday}</div><div className="text-sm text-gray-600">habits completed today</div></div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>This Week</span><span className="font-medium">{Math.round((habits.filter(h => h.completedToday).length / Math.max(1, habits.length)) * 100)}%</span></div>
                    <Progress value={(habits.filter(h => h.completedToday).length / Math.max(1, habits.length)) * 100} className="h-2" />
                    <div className="flex justify-between text-sm"><span>This Month</span><span className="font-medium">{completionRate}%</span></div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#D2B48C]/30 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#D2B48C] flex items-center gap-2"><Trophy className="w-5 h-5" />Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.unlocked ? "bg-[#FFCC99]/20 border border-[#FFCC99]/30" : "bg-gray-50 border border-gray-200"}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.unlocked ? "bg-[#FFCC99] text-white" : "bg-gray-200 text-gray-400"}`}>
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.unlocked ? "text-gray-800" : "text-gray-500"}`}>{achievement.name}</div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                      </div>
                      {achievement.unlocked && <CheckCircle2 className="w-5 h-5 text-[#C1E1C1]" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#D2B48C]/30 bg-gradient-to-br from-[#E6E6FA] to-[#ADD8E6] shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-lg font-medium text-white mb-2">"Success is the sum of small efforts repeated day in and day out."</div>
                <div className="text-sm text-white/80">- Robert Collier</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Edit Habit Dialog */}
      <Dialog open={isEditHabitOpen} onOpenChange={setIsEditHabitOpen}>
        <DialogContent className="bg-[#F5F0E1] border-[#D2B48C]">
          <DialogHeader>
            <DialogTitle className="text-[#D2B48C]">Edit Habit</DialogTitle>
          </DialogHeader>
          {editingHabit && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Habit Name</Label>
                <Input id="edit-name" value={editingHabit.name} onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })} className="border-[#D2B48C]/30" />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={editingHabit.description} onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })} className="border-[#D2B48C]/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingHabit.category} onValueChange={(value) => setEditingHabit({ ...editingHabit, category: value })}>
                    <SelectTrigger className="border-[#D2B48C]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select value={editingHabit.frequency} onValueChange={(value) => setEditingHabit({ ...editingHabit, frequency: value })}>
                    <SelectTrigger className="border-[#D2B48C]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Color Theme</Label>
                <div className="flex gap-2 mt-2">
                  {habitColors.map((color) => (
                    <button key={color} className={`w-8 h-8 rounded-full ${color} border-2 ${editingHabit.color === color ? "border-gray-800" : "border-gray-300"}`} onClick={() => setEditingHabit({ ...editingHabit, color })} />
                  ))}
                </div>
              </div>
              <div>
                <Label>Icon</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {iconOptions.map(({ name, icon: Icon }) => (
                    <button key={name} className={`p-2 rounded-lg border-2 ${editingHabit.icon === name ? "border-[#C1E1C1] bg-[#C1E1C1]/10" : "border-gray-300"}`} onClick={() => setEditingHabit({ ...editingHabit, icon: name })}>
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={updateHabitHandler} className="bg-[#C1E1C1] hover:bg-[#FFCC99] text-white flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditHabitOpen(false)} className="border-[#D2B48C] text-[#D2B48C]">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
    </ProtectedRoute>
  )
}

export default HabitsPage


