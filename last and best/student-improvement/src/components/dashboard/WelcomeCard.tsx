"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Plus } from "lucide-react"
import Link from "next/link"

interface WelcomeCardProps {
  userName: string
}

export default function WelcomeCard({ userName }: WelcomeCardProps) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  return (
    <Card className="bg-gradient-to-br from-[#C1E1C1] to-[#ADD8E6] border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-gray-700 text-lg">
              Ready to make today productive? Let's achieve your goals together.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/study">
              <Button className="bg-white/90 text-gray-800 hover:bg-white shadow-md">
                <Play className="w-4 h-4 mr-2" />
                Start Focus Session
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" className="border-white/50 text-gray-800 hover:bg-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}