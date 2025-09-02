"use client"

import type React from "react"

import { useMemo, useState, useRef, useEffect } from "react"
import { format, isSameMonth, startOfMonth, addMonths, subMonths } from "date-fns"
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToExpenses, createExpense, updateExpense, deleteExpense } from '../../services/expenses'
import { subscribeToBudgetSettings, saveBudgetSettings } from '../../services/budgets'
import ProtectedRoute from '../../components/ProtectedRoute'
import {
  Plus,
  CalendarIcon,
  Download,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Target,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DatePicker } from "@/components/DatePicker"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, Bar, Cell } from "recharts"
import Link from "next/link"

const triggerConfetti = () => {
  const colors = ["#C1E1C1", "#ADD8E6", "#FFCC99"]
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall 3s linear forwards;
    `
    document.body.appendChild(confetti)
    setTimeout(() => confetti.remove(), 3000)
  }
}

if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

export type Category = "Education" | "Food" | "Transport" | "Books" | "Fees" | "Entertainment" | "Other"

interface Expense {
  id: string
  date: Date
  category: Category
  amount: number
  note?: string
  userId?: string
}

const EDUCATION_SET: Category[] = ["Education", "Books", "Fees"]

const CATEGORY_META: Record<Category, { badge: string; tone: string }> = {
  Education: { badge: "bg-[#ADD8E6] text-white", tone: "bg-[#ADD8E6]/30" },
  Food: { badge: "bg-[#C1E1C1] text-white", tone: "bg-[#C1E1C1]/30" },
  Transport: { badge: "bg-[#D2B48C] text-white", tone: "bg-[#D2B48C]/30" },
  Books: { badge: "bg-[#E6E6FA] text-gray-800", tone: "bg-[#E6E6FA]/60" },
  Fees: { badge: "bg-[#FFCC99] text-white", tone: "bg-[#FFCC99]/50" },
  Entertainment: { badge: "bg-white text-gray-800 border border-[#D2B48C]", tone: "bg-[#D2B48C]/20" },
  Other: { badge: "bg-gray-200 text-gray-800", tone: "bg-gray-200" },
}



const monthBudgetDefault = 10000
const categoryBudgetsDefault: Partial<Record<Category, number>> = {
  Education: 120,
  Books: 40,
  Fees: 150,
  Food: 200,
  Transport: 60,
}

const ProgressRing = ({ value, label, colorVar }: { value: number; label: string; colorVar: string }) => {
  const clamped = Math.max(0, Math.min(100, value))
  const style = {
    background: `conic-gradient(${colorVar} ${clamped * 3.6}deg, #D2B48C ${clamped * 3.6}deg)`,
  } as React.CSSProperties
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-20 rounded-full" style={style}>
        <div className="absolute inset-1 rounded-full bg-white shadow-sm" />
        <div className="absolute inset-0 grid place-items-center text-sm font-semibold">{clamped}%</div>
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
}

export default function Budget() {
  const { user } = useAuth()
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()))
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!user?.uid) return
    
    const unsubscribe = subscribeToExpenses(user.uid, (fetchedExpenses) => {
      const processedExpenses = fetchedExpenses.map(e => ({
        ...e,
        date: e.date?.toDate ? e.date.toDate() : new Date(e.date)
      }))
      setExpenses(processedExpenses)
    })
    
    return unsubscribe
  }, [user?.uid])
  const [educationOnly, setEducationOnly] = useState(false)
  const [monthlyBudget, setMonthlyBudget] = useState<number>(monthBudgetDefault)
  const [categoryBudgets, setCategoryBudgets] = useState<Partial<Record<Category, number>>>(categoryBudgetsDefault)

  useEffect(() => {
    if (!user?.uid) return
    
    const unsubscribe = subscribeToBudgetSettings(user.uid, (budgetSettings) => {
      if (budgetSettings) {
        setMonthlyBudget(budgetSettings.monthlyBudget)
        setCategoryBudgets(budgetSettings.categoryBudgets)
        setBudgetForm({ monthly: budgetSettings.monthlyBudget, ...budgetSettings.categoryBudgets })
      }
    })
    
    return unsubscribe
  }, [user?.uid])

  const [planOpen, setPlanOpen] = useState(false)
  const [budgetForm, setBudgetForm] = useState({ monthly: monthBudgetDefault, ...categoryBudgetsDefault })

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Expense, "id">>({ date: new Date(), category: "Food", amount: 0, note: "" })

  const [goal, setGoal] = useState<{ amount: number; saved: number; due: Date }>({
    amount: 300,
    saved: 120,
    due: addMonths(new Date(), 2),
  })
  const prevSavedRef = useRef(goal.saved)
  useEffect(() => {
    if (prevSavedRef.current < goal.amount && goal.saved >= goal.amount) {
      triggerConfetti()
    }
    prevSavedRef.current = goal.saved
  }, [goal.saved, goal.amount])

  const monthExpenses = useMemo(() => {
    let filtered = expenses.filter((e) => isSameMonth(e.date, month))
    
    if (educationOnly) {
      filtered = filtered.filter(e => EDUCATION_SET.includes(e.category))
    }
    
    if (filterCategory !== 'All') {
      filtered = filtered.filter(e => e.category === filterCategory)
    }
    
    return filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }, [expenses, month, educationOnly, filterCategory, sortBy, sortOrder])

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = Math.max(0, monthlyBudget - totalSpent)
  const spentPct = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0

  const byCategory = useMemo(() => {
    const map = new Map<Category, number>()
    monthExpenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount))
    return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }))
  }, [monthExpenses])

  const highest = byCategory.reduce((m, c) => Math.max(m, c.amount), 0)

  function nextMonth() {
    setMonth(addMonths(month, 1))
  }
  function prevMonth() {
    setMonth(subMonths(month, 1))
  }

  function openAdd() {
    setEditingId(null)
    setForm({ date: new Date(), category: "Food", amount: 0, note: "" })
    setOpen(true)
  }

  function openEdit(exp: Expense) {
    setEditingId(exp.id)
    setForm({ date: exp.date, category: exp.category, amount: exp.amount, note: exp.note || "" })
    setOpen(true)
  }

  async function saveExpense() {
    if (!form.amount || form.amount <= 0 || !user?.uid) return
    
    try {
      if (editingId) {
        await updateExpense(editingId, form)
      } else {
        await createExpense(user.uid, form)
      }
      setOpen(false)
    } catch (error) {
      console.error('Error saving expense:', error)
    }
  }

  async function deleteExpenseHandler(id: string) {
    try {
      await deleteExpense(id)
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const urlRef = useRef<string | null>(null)
  
  function exportCSV() {
    try {
      // Revoke previous URL if exists
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
      }
      
      const rows = [
        ["Date", "Category", "Amount", "Note"],
        ...monthExpenses.map((e) => [format(e.date, "yyyy-MM-dd"), e.category, e.amount.toFixed(2), e.note || ""]),
      ]
      const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      
      const a = document.createElement("a")
      a.href = url
      a.download = `budget-${format(month, "yyyy-MM")}.csv`
      a.click()
      
      // Clean up after a delay
      setTimeout(() => {
        if (urlRef.current) {
          URL.revokeObjectURL(urlRef.current)
          urlRef.current = null
        }
      }, 1000)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  async function saveBudgetPlan() {
    if (!user?.uid) return
    
    try {
      const newCategoryBudgets = {
        Education: budgetForm.Education || 0,
        Books: budgetForm.Books || 0,
        Fees: budgetForm.Fees || 0,
        Food: budgetForm.Food || 0,
        Transport: budgetForm.Transport || 0,
      }
      
      await saveBudgetSettings(user.uid, budgetForm.monthly, newCategoryBudgets)
      setMonthlyBudget(budgetForm.monthly)
      setCategoryBudgets(newCategoryBudgets)
      setPlanOpen(false)
    } catch (error) {
      console.error('Error saving budget:', error)
    }
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#F5F0E1]">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="shrink-0">
            <Button variant="outline" className="border-[#D2B48C] hover:bg-[#D2B48C]/10">
              <LayoutDashboard className="mr-2 size-4" /> Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-2xl text-gray-800">Budget — Manage Your Spending</h1>
            <p className="text-sm text-gray-600">Calm, clear budgeting tailored for students</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPlanOpen(true)}
            className="border-[#D2B48C] hover:bg-[#D2B48C]/10"
          >
            Set Budget
          </Button>
          <Button
            variant="outline"
            onClick={prevMonth}
            className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="rounded-md border border-[#D2B48C] px-3 py-1 text-sm bg-white">
            <CalendarIcon className="mr-2 inline size-4" /> {format(month, "LLLL yyyy")}
          </div>
          <Button
            variant="outline"
            onClick={nextMonth}
            className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button onClick={openAdd} className="ml-2 bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 text-white">
            <Plus className="mr-2 size-4" /> Add Expense
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Spent</div>
              <div className="text-2xl font-bold text-gray-800">₹{totalSpent.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="text-2xl font-bold text-[#C1E1C1]">₹{remaining.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Transactions</div>
              <div className="text-2xl font-bold text-gray-800">{monthExpenses.length}</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <DollarSign className="size-5" /> Budget vs Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <ProgressRing value={spentPct} label="Used this month" colorVar="#C1E1C1" />
            <div className="text-right">
              <p className="text-xs text-gray-600">Planned</p>
              <p className="text-xl font-bold text-gray-800">₹{monthlyBudget.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">Remaining</p>
              <p className="text-lg font-semibold text-[#C1E1C1]">₹{remaining.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Target className="size-4" /> Savings Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <ProgressRing
              value={Math.min(100, Math.round((goal.saved / goal.amount) * 100))}
              label="Progress"
              colorVar="#FFCC99"
            />
            <div className="text-right">
              <p className="text-xs text-gray-600">Goal</p>
              <p className="text-xl font-bold text-gray-800">₹{goal.amount.toFixed(0)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                <TrendingUp className="size-3" /> Due {format(goal.due, "PPP")}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={goal.saved}
                  onChange={(e) => setGoal({ ...goal, saved: Number(e.target.value) })}
                  className="h-8 w-24 border-[#D2B48C]"
                />
                <Button
                  variant="outline"
                  className="h-8 border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent"
                  onClick={() => setGoal({ ...goal, saved: goal.saved + 20 })}
                >
                  +20
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BookOpen className="size-4" /> Educational Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Total in {format(month, "LLLL")}</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹
                {monthExpenses
                  .filter((e) => EDUCATION_SET.includes(e.category))
                  .reduce((s, e) => s + e.amount, 0)
                  .toFixed(2)}
              </p>
              <Badge className="mt-2 bg-[#ADD8E6] text-white">Education Focus</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Show only edu</span>
              <Switch checked={educationOnly} onCheckedChange={setEducationOnly} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Filter className="size-5" /> Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {byCategory.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-gray-600">No data this month.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ left: 24, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={100} />
                  <RTooltip
                    formatter={(v: any) => [`₹${Number(v).toFixed(2)}`, "Spent"]}
                    cursor={{ fill: "#E6E6FA", opacity: 0.3 }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                    {byCategory.map((entry, index) => {
                      const planned = categoryBudgets[entry.category as Category] || 0
                      const isMax = entry.amount === highest && highest > 0
                      const overspend = planned > 0 && entry.amount > planned
                      const fill = overspend ? "#FFCC99" : isMax ? "#C1E1C1" : "#ADD8E6"
                      return <Cell key={`cell-${index}`} fill={fill} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800">Reports & Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-md bg-[#ADD8E6]/30 p-3 text-gray-700">
              Tip: Prep lunches twice a week to save ~₹
              {(monthExpenses.filter((e) => e.category === "Food").reduce((s, e) => s + e.amount, 0) * 0.2).toFixed(0)}{" "}
              this month.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Export this month</span>
              <Button
                variant="outline"
                className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent"
                onClick={exportCSV}
              >
                <Download className="mr-2 size-4" /> CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-bold text-xl text-gray-800">Expenses</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as Category | 'All')}>
              <SelectTrigger className="w-32 border-[#D2B48C]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {Object.keys(CATEGORY_META).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field as 'date' | 'amount' | 'category')
              setSortOrder(order as 'asc' | 'desc')
            }}>
              <SelectTrigger className="w-40 border-[#D2B48C]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                <SelectItem value="category-asc">Category A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent" onClick={openAdd}>
              <Plus className="mr-2 size-4" /> Add Expense
            </Button>
          </div>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-[#D2B48C]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0">
            {monthExpenses.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-3 max-w-lg rounded-md bg-[#E6E6FA]/60 p-4">
                  <p className="font-medium text-gray-800">No expenses yet</p>
                  <p className="text-sm text-gray-600">Start tracking expenses to build smart habits.</p>
                </div>
                <Button onClick={openAdd} className="bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 text-white">
                  Start Tracking
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {monthExpenses.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-md bg-[#D2B48C]/40 text-xs font-semibold text-white">
                        {format(e.date, "d")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={`${CATEGORY_META[e.category].badge}`}>{e.category}</Badge>
                          <span className="truncate text-sm text-gray-600">{e.note || "—"}</span>
                        </div>
                        <p className="text-xs text-gray-500">{format(e.date, "EEE, PPP")}</p>
                        {(() => {
                          const planned = categoryBudgets[e.category] || 0
                          const pct = planned > 0 ? Math.min(100, Math.round((e.amount / planned) * 100)) : 0
                          return (
                            <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full ${pct >= 100 ? "bg-[#FFCC99]" : "bg-[#ADD8E6]"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="w-24 text-right text-base font-semibold text-gray-800">
                        ₹{e.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-transparent"
                        onClick={() => openEdit(e)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#D2B48C] hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
                        onClick={() => deleteExpenseHandler(e.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-[#D2B48C] rounded-2xl sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle className="text-gray-800">{editingId ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <p className="text-sm text-gray-600">Log a purchase quickly with clear fields and handy shortcuts.</p>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-gray-700">Date</Label>
              <DatePicker
                value={form.date}
                onChange={(date) => setForm({ ...form, date })}
                placeholder="Select date"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-gray-700">Category</Label>
                <Select value={form.category as any} onValueChange={(v) => setForm({ ...form, category: v as any })}>
                  <SelectTrigger className="border-[#D2B48C]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
                      <SelectItem key={cat} value={cat as any}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">Choices: {(Object.keys(CATEGORY_META) as Category[]).join(", ")}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-700">Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="border-[#D2B48C] bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20, 50].map((inc) => (
                    <Button
                      key={inc}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 border-[#D2B48C] hover:bg-[#D2B48C]/10"
                      onClick={() => setForm({ ...form, amount: Number(form.amount || 0) + inc })}
                    >
                      +{inc}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-700">Note</Label>
              <Textarea
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <div className="h-px bg-[#D2B48C]/30" />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                className="border-[#D2B48C] hover:bg-[#D2B48C]/10 bg-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={saveExpense} className="bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 text-white">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="bg-white border-[#D2B48C]">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-gray-700">Total Monthly Budget</Label>
              <Input
                type="number"
                min="0"
                value={budgetForm.monthly}
                onChange={(e) => setBudgetForm({ ...budgetForm, monthly: Number(e.target.value) })}
                className="border-[#D2B48C]"
              />
            </div>
            <div className="grid gap-3">
              <Label className="text-gray-700">Category Budgets</Label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(categoryBudgetsDefault) as Category[]).map((cat) => (
                  <div key={cat} className="grid gap-1">
                    <Label className="text-xs text-gray-600">{cat}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={budgetForm[cat] || 0}
                      onChange={(e) => setBudgetForm({ ...budgetForm, [cat]: Number(e.target.value) } as any)}
                      className="border-[#D2B48C]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setPlanOpen(false)}
                className="border-[#D2B48C] hover:bg-[#D2B48C]/10"
              >
                Cancel
              </Button>
              <Button onClick={saveBudgetPlan} className="bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 text-white">
                Save Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        <div className="fixed bottom-6 right-6 md:hidden">
          <Button onClick={openAdd} className="size-12 rounded-full bg-[#C1E1C1] hover:bg-[#C1E1C1]/90 p-0 shadow-lg">
            <Plus className="size-5" />
          </Button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}


