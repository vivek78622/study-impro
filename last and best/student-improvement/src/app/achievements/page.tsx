"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Trophy, Star, Flame, CheckCircle2 } from "lucide-react"

export default function Achievements() {
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all")
  const badges = useMemo(() => [
    { id: 1, title: "First Task", icon: Star, earned: true, date: "2024-01-10" },
    { id: 2, title: "Week Streak", icon: Flame, earned: true, date: "2024-01-14" },
    { id: 3, title: "Grade A+", icon: Trophy, earned: false },
    { id: 4, title: "Budget Saver", icon: Award, earned: true, date: "2024-01-20" },
  ], [])
  const filtered = badges.filter((b) => (filter === "all" ? true : filter === "earned" ? b.earned : !b.earned))

  return (
    <main className="min-h-screen bg-[#F5F0E1] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Achievements & Profile</h1>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
            <Button variant={filter === "earned" ? "default" : "outline"} onClick={() => setFilter("earned")}>Earned</Button>
            <Button variant={filter === "locked" ? "default" : "outline"} onClick={() => setFilter("locked")}>Locked</Button>
          </div>
        </div>

        <Card className="border-[#D2B48C]">
          <CardHeader>
            <CardTitle className="text-gray-800">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((b) => (
                <div key={b.id} className={`p-4 rounded-lg border ${b.earned ? "bg-[#C1E1C1]/20 border-[#C1E1C1]" : "bg-white border-[#D2B48C]/40"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${b.earned ? "bg-[#C1E1C1] text-gray-800" : "bg-[#E6E6FA] text-gray-700"}`}>
                    <b.icon className="w-6 h-6" />
                  </div>
                  <p className="text-center mt-2 text-sm font-medium text-gray-800">{b.title}</p>
                  {b.earned ? (
                    <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#C1E1C1]" /> {b.date}</p>
                  ) : (
                    <p className="text-center text-xs text-gray-500">Locked</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D2B48C]">
          <CardHeader>
            <CardTitle className="text-gray-800">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#C1E1C1] text-gray-800">Cozy Density</Badge>
              <Badge className="bg-[#ADD8E6] text-gray-800">Notifications: Enabled</Badge>
              <Badge className="bg-[#FFCC99] text-gray-800">Sync: Manual</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


