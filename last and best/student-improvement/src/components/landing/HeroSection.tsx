"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles, Users, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeMetric, setActiveMetric] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { icon: Users, value: "10K+", label: "Active Students" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
    { icon: Sparkles, value: "4.9/5", label: "User Rating" }
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2322C1A3%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-8">
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Badge className="bg-[#22C1A3]/10 text-[#22C1A3] border-[#22C1A3]/20 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Study Assistant
            </Badge>
          </div>

          <div className={`space-y-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-[#22C1A3] to-[#ADD8E6] bg-clip-text text-transparent">
                Study Journey
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your academic performance with AI-powered focus sessions, smart task management, and personalized insights.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/start">
              <Button className="bg-[#22C1A3] hover:bg-[#1ea085] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </Link>
          </div>

          <div className={`flex items-center justify-center gap-6 text-sm text-gray-400 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C1A3]" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C1A3]" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C1A3]" />
              Setup in 2 minutes
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div 
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    activeMetric === index ? 'scale-110 text-[#22C1A3]' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm">{metric.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F0E1] to-transparent" />
    </section>
  )
}