"use client"

import * as React from "react"

interface GrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export function GrowButton({ variant = "default", className = "", children, ...props }: GrowButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ADD8E6]"
  const styles = variant === "outline"
    ? "border border-[#D2B48C] bg-white text-gray-800 hover:bg-[#ADD8E6]/20"
    : "bg-[#C1E1C1] text-gray-800 hover:bg-[#B5D6B5]"
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default GrowButton


