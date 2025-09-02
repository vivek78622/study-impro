"use client"

import { Star } from "lucide-react"

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#22C1A3] mb-2">2,847+</div>
            <div className="text-gray-400">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#22C1A3] mb-2">1,25,000+</div>
            <div className="text-gray-400">Focus Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#22C1A3] mb-2">94%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFB86B] text-[#FFB86B]" />
              ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"Finally, a focus app that actually helps me study better."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#22C1A3] rounded-full flex items-center justify-center text-white font-semibold">SC</div>
              <div>
                <div className="font-semibold text-white">Sarah Chen</div>
                <div className="text-sm text-gray-400">Computer Science</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFB86B] text-[#FFB86B]" />
              ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"The 25-minute sessions are perfect for my study schedule."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#22C1A3] rounded-full flex items-center justify-center text-white font-semibold">MJ</div>
              <div>
                <div className="font-semibold text-white">Marcus Johnson</div>
                <div className="text-sm text-gray-400">Pre-Med</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFB86B] text-[#FFB86B]" />
              ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"Love how it tracks my habits and budget in one place."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#22C1A3] rounded-full flex items-center justify-center text-white font-semibold">ER</div>
              <div>
                <div className="font-semibold text-white">Emma Rodriguez</div>
                <div className="text-sm text-gray-400">Business Major</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}