"use client"

import { Clock, Target, BarChart3, Shield } from "lucide-react"

export default function FeatureBento() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-[#22C1A3]">Study smarter</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Everything you need to succeed academically
        </p>
        
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Focus Sessions - Large Left */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#22C1A3]" />
                  <p className="text-lg font-medium tracking-tight text-white">Focus Sessions</p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                  25 & 60 minute Pomodoro timers with calming backgrounds and progress tracking to maximize your study efficiency.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gradient-to-br from-[#C1E1C1]/20 to-[#ADD8E6]/20">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-4">25:00</div>
                      <div className="w-32 h-32 rounded-full border-8 border-[#22C1A3] border-t-transparent animate-spin mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/15 lg:rounded-l-[2rem]"></div>
          </div>

          {/* Analytics - Top Right */}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-[#22C1A3]" />
                  <p className="text-lg font-medium tracking-tight text-white">Smart Analytics</p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                  Track your progress with detailed insights and productivity metrics.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <div className="w-full max-w-xs">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#C1E1C1]/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">85%</div>
                      <div className="text-xs text-gray-400">Focus Rate</div>
                    </div>
                    <div className="bg-[#ADD8E6]/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-xs text-gray-400">Sessions</div>
                    </div>
                    <div className="bg-[#FFCC99]/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">7</div>
                      <div className="text-xs text-gray-400">Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/15 max-lg:rounded-t-[2rem]"></div>
          </div>

          {/* Task Management - Bottom Middle */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-gray-800"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-[#22C1A3]" />
                  <p className="text-lg font-medium tracking-tight text-white">Task Management</p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                  Organize assignments, deadlines, and study goals in one place.
                </p>
              </div>
              <div className="flex flex-1 items-center max-lg:py-6 lg:pb-2 px-8">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-3 p-2 bg-[#C1E1C1]/10 rounded">
                    <div className="w-4 h-4 rounded border-2 border-[#22C1A3]"></div>
                    <span className="text-sm text-gray-300">Complete Biology Assignment</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-[#ADD8E6]/10 rounded">
                    <div className="w-4 h-4 rounded bg-[#22C1A3]"></div>
                    <span className="text-sm text-gray-300 line-through">Math Problem Set</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/15"></div>
          </div>

          {/* Budget Tracking - Large Right */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#22C1A3]" />
                  <p className="text-lg font-medium tracking-tight text-white">Budget Tracking</p>
                </div>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                  Keep track of your student expenses and manage your budget effectively.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900/60 ring-1 ring-white/10">
                  <div className="flex bg-gray-900 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                        Budget Overview
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Monthly Budget</span>
                      <span className="text-white font-semibold">$800</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-[#22C1A3] h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Food & Dining</span>
                        <span>$320</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Books & Supplies</span>
                        <span>$180</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Transportation</span>
                        <span>$120</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/15 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}