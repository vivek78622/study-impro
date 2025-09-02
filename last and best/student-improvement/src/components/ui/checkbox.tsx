"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      onChange?.(e)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-[#D2B48C] bg-white transition-colors duration-200 cursor-pointer",
            "hover:border-[#C1E1C1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ADD8E6] focus-visible:ring-offset-2",
            checked && "bg-[#C1E1C1] border-[#C1E1C1]",
            className
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          {checked && (
            <Check className="h-3 w-3 text-white m-0.5" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }