"use client"

import { InteractiveDots } from './interactive-dots'

interface BentoBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: 'dark' | 'light'
}

export function BentoBackground({ 
  children, 
  className = "",
  variant = 'dark'
}: BentoBackgroundProps) {
  const isDark = variant === 'dark'
  
  return (
    <div className={`relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${className}`}>
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Interactive Dots */}
      <InteractiveDots
        dotColor={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
        activeDotColor={isDark ? "rgba(34, 193, 163, 0.6)" : "rgba(34, 193, 163, 0.8)"}
        dotSize={2}
        spacing={40}
        maxDistance={120}
      />
      
      {/* Gradient Overlays */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900/50 via-transparent to-gray-800/50' 
          : 'bg-gradient-to-br from-white/50 via-transparent to-gray-100/50'
      }`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}