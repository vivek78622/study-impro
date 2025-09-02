"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, CheckCircle2, Clock, Target, BarChart3 } from "lucide-react"
import SplineViewer from "@/components/SplineViewer"

export default function LiveDemo() {
  const [activeDemo, setActiveDemo] = useState<'tasks' | 'focus' | 'insights'>('focus')
  const [isPlaying, setIsPlaying] = useState(false)

  const demoStates = {
    tasks: {
      title: "Task Management",
      description: "Organize your assignments and deadlines",
      icon: CheckCircle2,
      color: "bg-[#22C1A3]"
    },
    focus: {
      title: "Focus Sessions", 
      description: "25-minute Pomodoro timer with progress tracking",
      icon: Clock,
      color: "bg-[#FFB86B]"
    },
    insights: {
      title: "Progress Insights",
      description: "Track your productivity and study habits",
      icon: BarChart3,
      color: "bg-[#A7D8F5]"
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#F5F0E1] to-[#E6E6FA]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
          <p className="text-xl text-gray-600">Experience the app without leaving this page</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(demoStates).map(([key, state]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key as any)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    activeDemo === key 
                      ? 'bg-white shadow-lg border-2 border-[#22C1A3]' 
                      : 'bg-white/60 hover:bg-white/80 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${state.color} rounded-xl flex items-center justify-center`}>
                      <state.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{state.title}</h3>
                      <p className="text-sm text-gray-600">{state.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#22C1A3] hover:bg-[#1ea085] text-white px-6 py-3 rounded-xl"
              >
                {isPlaying ? <Pause className="mr-2 w-5 h-5" /> : <Play className="mr-2 w-5 h-5" />}
                {isPlaying ? 'Pause Demo' : 'Play Demo'}
              </Button>
              <Badge className="bg-[#FFB86B]/10 text-[#FFB86B] px-4 py-2">
                Interactive Preview
              </Badge>
            </div>
          </div>

          {/* Demo Display */}
          <div className="relative">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full h-[400px]">
                  <SplineViewer 
                    url="https://my.spline.design/miniroomremakecopyprogrammerroom-I37EGeJKdKJWUM9xIq30n8qL/" 
                    className="w-full h-full"
                  />
                  
                  {/* Demo State Overlay */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-[#22C1A3] animate-pulse' : 'bg-gray-300'}`} />
                          <span className="text-sm font-medium">
                            {demoStates[activeDemo].title}
                          </span>
                        </div>
                        <Badge className="bg-[#22C1A3]/10 text-[#22C1A3] text-xs">
                          Live Demo
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        {demoStates[activeDemo].description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}