"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  { 
    name: "Sarah Chen", 
    role: "Computer Science", 
    text: "Finally, a focus app that actually helps me study better.", 
    avatar: "SC" 
  },
  { 
    name: "Marcus Johnson", 
    role: "Pre-Med", 
    text: "The 25-minute sessions are perfect for my study schedule.", 
    avatar: "MJ" 
  },
  { 
    name: "Emma Rodriguez", 
    role: "Business Major", 
    text: "Love how it tracks my habits and budget in one place.", 
    avatar: "ER" 
  }
]

export default function SocialProof() {
  const [metrics, setMetrics] = useState({ users: 0, minutes: 0, retention: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({ users: 2847, minutes: 125000, retention: 94 })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-r from-[#22C1A3]/5 to-[#A7D8F5]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "Active Students", value: metrics.users, suffix: "+" },
            { label: "Focus Minutes", value: metrics.minutes, suffix: "+" },
            { label: "Success Rate", value: metrics.retention, suffix: "%" }
          ].map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#22C1A3] mb-2">
                {metric.value.toLocaleString()}{metric.suffix}
              </div>
              <div className="text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB86B] text-[#FFB86B]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#22C1A3] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}