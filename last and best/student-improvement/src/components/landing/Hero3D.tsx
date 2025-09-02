"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BentoBackground } from "@/components/ui/bento-background"
import { ArrowRight, Play, Sparkles, CheckCircle2 } from "lucide-react"
import SplineViewer from "@/components/SplineViewer"
import Link from "next/link"

export default function Hero3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <BentoBackground variant="dark" className="min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <Badge className="bg-gradient-to-r from-[#22C1A3]/20 to-[#ADD8E6]/20 text-[#22C1A3] border-[#22C1A3]/30 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Study Platform
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Study in</span>
              <br />
              <span className="bg-gradient-to-r from-[#22C1A3] via-[#ADD8E6] to-[#C1E1C1] bg-clip-text text-transparent">
                3D Reality
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
              Experience immersive learning with 3D environments, AI-powered focus sessions, and spatial task management that transforms how you study.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-[#22C1A3] to-[#1ea085] hover:from-[#1ea085] hover:to-[#16a085] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-[#22C1A3]/25 transition-all duration-300 hover:scale-105 group">
                  Enter 3D Study Space
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-2xl group">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {["Immersive 3D", "AI-Powered", "Real-time Sync"].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C1A3]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right 3D Model */}
          <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* 3D Model Container */}
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-2xl">
                <SplineViewer 
                  url="https://my.spline.design/miniroomremakecopyprogrammerroom-I37EGeJKdKJWUM9xIq30n8qL/" 
                  className="w-full h-full"
                />
                
                {/* Overlay UI Elements */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <Badge className="bg-black/20 text-white backdrop-blur-sm border-white/20">
                    3D Study Room
                  </Badge>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs">Live</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#22C1A3] rounded-full animate-pulse" />
                        <span className="text-sm">Focus Session Active</span>
                      </div>
                      <span className="text-lg font-mono">25:00</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-[#22C1A3] to-[#ADD8E6] h-1 rounded-full w-3/4 transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              </div>



              {/* Glow Effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#22C1A3]/20 to-[#ADD8E6]/20 blur-xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </BentoBackground>
  )
}