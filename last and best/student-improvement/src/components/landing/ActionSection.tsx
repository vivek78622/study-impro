"use client"

import { Clock, Target, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ActionSection() {
  return (
    <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-[#22C1A3]">Study smarter</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                Transform your academic journey
              </p>
              <p className="mt-6 text-lg/8 text-gray-300">
                Experience the future of studying with AI-powered focus sessions, intelligent task management, and personalized insights that adapt to your learning style.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-white">
                    <Clock className="absolute top-1 left-1 size-5 text-[#22C1A3]" />
                    Smart Focus Sessions.
                  </dt>
                  <dd className="inline">
                    25 & 60 minute Pomodoro timers with ambient sounds and progress tracking to maximize your study efficiency.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-white">
                    <Target className="absolute top-1 left-1 size-5 text-[#22C1A3]" />
                    Intelligent Task Management.
                  </dt>
                  <dd className="inline">
                    AI-powered organization that prioritizes your assignments and deadlines based on importance and due dates.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-white">
                    <BarChart3 className="absolute top-1 left-1 size-5 text-[#22C1A3]" />
                    Personalized Analytics.
                  </dt>
                  <dd className="inline">
                    Detailed insights into your study patterns, productivity trends, and habit formation to optimize your learning.
                  </dd>
                </div>
              </dl>
              <div className="mt-10">
                <Link href="/login">
                  <Button className="bg-[#22C1A3] hover:bg-[#1ea085] text-white px-8 py-3 text-lg font-semibold rounded-xl">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <img 
            width="2432" 
            height="1442" 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="Students studying with modern technology" 
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" 
          />
        </div>
      </div>
    </div>
  )
}