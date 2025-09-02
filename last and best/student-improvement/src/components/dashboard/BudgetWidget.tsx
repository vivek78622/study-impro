"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToExpenses } from '../../services/expenses'
import { subscribeToBudgetSettings } from '../../services/budgets'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, ArrowUpRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BudgetData {
  totalIncome: number
  totalExpenses: number
  balance: number
  budgetLimit: number
  categoryBreakdown: { category: string; amount: number; percentage: number }[]
}

export default function BudgetWidget() {
  const { user } = useAuth()
  const router = useRouter()
  const [budgetData, setBudgetData] = useState<BudgetData>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budgetLimit: 10000,
    categoryBreakdown: []
  })
  const [loading, setLoading] = useState(true)
  const [monthlyBudget, setMonthlyBudget] = useState(10000)

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribeBudget = subscribeToBudgetSettings(user.uid, (budgetSettings) => {
      if (budgetSettings) {
        setMonthlyBudget(budgetSettings.monthlyBudget)
      }
    })

    const unsubscribeExpenses = subscribeToExpenses(user.uid, (expenses) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })

      const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      const balance = monthlyBudget - totalExpenses

      // Calculate category breakdown
      const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {} as Record<string, number>)

      const categoryBreakdown = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 4)

      setBudgetData({
        totalIncome: monthlyBudget,
        totalExpenses,
        balance,
        budgetLimit: monthlyBudget,
        categoryBreakdown
      })
      setLoading(false)
    })

    return () => {
      unsubscribeBudget()
      unsubscribeExpenses()
    }
  }, [user?.uid, monthlyBudget])

  const progressPercentage = Math.min((budgetData.totalExpenses / budgetData.budgetLimit) * 100, 100)
  const isOverBudget = budgetData.totalExpenses > budgetData.budgetLimit

  if (loading) {
    return (
      <Card className="h-full bg-white rounded-3xl shadow-sm border-0">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="h-full bg-white rounded-3xl shadow-sm border-0 cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => router.push('/budget')}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Budget Overview</CardTitle>
            <p className="text-gray-500 text-sm">Track your monthly spending and savings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              ₹{budgetData.balance.toFixed(0)} saved
            </Badge>
            <div className="flex bg-gray-100 p-1 rounded-full">
              <Button size="sm" className="bg-white shadow-sm rounded-full h-8">Month</Button>
              <Button variant="ghost" size="sm" className="text-gray-500 h-8">Year</Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          {/* Spending Progress */}
          <div className="space-y-6">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke={isOverBudget ? "#EF4444" : "#FFDAB9"}
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-gray-900">₹{budgetData.totalExpenses.toFixed(0)}</p>
                <p className="text-sm text-gray-500">of ₹{budgetData.budgetLimit} spent</p>
                <p className={`text-xs font-medium ${isOverBudget ? 'text-red-600' : 'text-orange-600'}`}>
                  {progressPercentage.toFixed(0)}% used
                </p>
              </div>
            </div>
          </div>
          
          {/* Budget Breakdown */}
          <div className="space-y-4">
            {budgetData.categoryBreakdown.length > 0 ? (
              budgetData.categoryBreakdown.map((item, index) => (
                <div key={item.category} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm font-semibold">₹{item.amount.toFixed(0)}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2 bg-gray-200" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No expenses recorded this month</p>
                <p className="text-xs">Start tracking your spending</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-600">Remaining</span>
                <span className="text-lg font-bold text-green-600">₹{budgetData.balance.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}