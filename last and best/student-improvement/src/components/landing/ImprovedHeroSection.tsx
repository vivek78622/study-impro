"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowRight, Play, Sparkles, Users, TrendingUp, CheckCircle2, Clock, Target, BookOpen } from "lucide-react"
import Link from "next/link"

export default function ImprovedHeroSection() {
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Clock, title: "Focus Sessions", desc: "25 & 60 min timers", color: "from-[#C1E1C1] to-[#ADD8E6]" },
    { icon: Target, title: "Smart Tasks", desc: "AI-powered organization", color: "from-[#FFCC99] to-[#FFB86B]" },
    { icon: BookOpen, title: "Progress Tracking", desc: "Detailed insights", color: "from-[#E6E6FA] to-[#D2B48C]" }
  ]

  const stats = [
    { value: "15K+", label: "Students", icon: Users },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
    { value: "4.9★", label: "Rating", icon: Sparkles }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F5F0E1] via-white to-[#E6E6FA]/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C1E1C1]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ADD8E6]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFCC99]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Badge className="bg-gradient-to-r from-[#22C1A3]/10 to-[#ADD8E6]/10 text-[#22C1A3] border-[#22C1A3]/20 px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Study Platform
              </Badge>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Transform Your</span>
                <br />
                <span className="bg-gradient-to-r from-[#22C1A3] via-[#ADD8E6] to-[#C1E1C1] bg-clip-text text-transparent">
                  Study Success
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Master your academic journey with intelligent focus sessions, seamless task management, and personalized insights that adapt to your learning style.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link href="/start">
                <Button className="bg-gradient-to-r from-[#22C1A3] to-[#1ea085] hover:from-[#1ea085] hover:to-[#16a085] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-2xl group">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Live Demo
                </Button>
              </Link>
            </div>

            <div className={`flex flex-wrap items-center gap-6 text-sm text-gray-500 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {["No credit card", "Free forever", "2-min setup"].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C1A3]" />
                  {text}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 pt-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                    <stat.icon className="w-4 h-4" />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Main Feature Card */}
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#C1E1C1]/20 text-[#22C1A3]">Live Preview</Badge>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                  </div>

                  {/* Feature Showcase */}
                  <div className="space-y-4">
                    {features.map((feature, i) => {
                      const Icon = feature.icon
                      const isActive = activeFeature === i
                      return (
                        <div key={i} className={`p-4 rounded-xl transition-all duration-500 ${
                          isActive ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105` : 'bg-gray-50 text-gray-600'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6" />
                            <div>
                              <div className="font-semibold">{feature.title}</div>
                              <div className="text-sm opacity-80">{feature.desc}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Mock Timer */}
                  <div className="bg-gradient-to-br from-[#C1E1C1]/20 to-[#ADD8E6]/20 p-6 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800 mb-2">25:00</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-gradient-to-r from-[#22C1A3] to-[#ADD8E6] h-2 rounded-full w-3/4 transition-all duration-1000" />
                      </div>
                      <div className="text-sm text-gray-600">Focus Session Active</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFCC99] to-[#FFB86B] rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#E6E6FA] to-[#D2B48C] rounded-xl flex items-center justify-center shadow-xl animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}