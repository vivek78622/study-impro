"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean }
>(({ className, open, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props}>
    {children}
  </div>
))
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn("", className)} {...props}>
    {children}
  </button>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean }
>(({ className, open, children, ...props }, ref) => (
  open ? (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-[#D2B48C]/20 py-2 z-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ) : null
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 py-2 text-sm text-[#0F172A] hover:bg-[#F5F0E1] cursor-pointer",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}