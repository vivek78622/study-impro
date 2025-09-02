"use client"

import * as React from "react"
import { createContext, useContext, useMemo } from "react"

interface SheetContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = createContext<SheetContextType | undefined>(undefined)

export function Sheet({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode }) {
  return (
    <SheetContext.Provider value={{ open: open || false, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const context = useContext(SheetContext)
  if (!context) return <>{children}</>
  
  const { onOpenChange } = context
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: any) => {
        onOpenChange(true)
        if (children.props.onClick) {
          children.props.onClick(e)
        }
      }
    })
  }
  
  return (
    <div onClick={() => onOpenChange(true)}>
      {children}
    </div>
  )
}

export function SheetContent({ side = "right", className = "", children }: { side?: "right" | "left" | "top" | "bottom"; className?: string; children: React.ReactNode }) {
  const context = useContext(SheetContext)
  
  const sideClasses = useMemo(() => ({
    right: "right-0 translate-x-full data-[state=open]:translate-x-0",
    left: "left-0 -translate-x-full data-[state=open]:translate-x-0",
    top: "top-0 -translate-y-full data-[state=open]:translate-y-0",
    bottom: "bottom-0 translate-y-full data-[state=open]:translate-y-0"
  }), [])
  
  if (!context) return null
  
  const { open, onOpenChange } = context
  
  if (!open) return null
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet Content */}
      <div 
        className={`fixed z-50 w-full max-w-md bg-white border border-[#D2B48C] shadow-xl transition-transform duration-300 ease-in-out ${
          side === "right" ? "inset-y-0" : 
          side === "left" ? "inset-y-0" :
          side === "top" ? "inset-x-0" :
          "inset-x-0"
        } ${sideClasses[side]} ${className || ""}`}
        data-state={open ? "open" : "closed"}
      >
        <div className="p-4 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function SheetTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600">{children}</p>
}


