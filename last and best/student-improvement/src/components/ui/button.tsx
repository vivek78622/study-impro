"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "hero" | "floating"
type ButtonSize = "sm" | "md" | "lg" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] disabled:opacity-50 disabled:pointer-events-none"

const variantClass: Record<ButtonVariant, string> = {
  default: "bg-[#C1E1C1] text-gray-800 hover:bg-[#C1E1C1]/90",
  outline:
    "bg-transparent border border-[#D2B48C] text-gray-800 hover:bg-[#ADD8E6]/20",
  ghost: "bg-transparent text-gray-700 hover:bg-black/5",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  hero: "bg-[#C1E1C1] text-gray-800 hover:bg-[#B5D6B5] shadow-lg hover:shadow-xl transition-all duration-300",
  floating: "bg-[#C1E1C1] text-white hover:bg-[#B5D6B5] shadow-lg hover:shadow-xl transition-all duration-300 rounded-full",
}

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
}

export const buttonVariants = ({ variant = "default", size = "md", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) => {
  return cn(base, variantClass[variant], sizeClass[size], className)
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export default Button


