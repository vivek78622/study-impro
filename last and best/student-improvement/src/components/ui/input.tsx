import * as React from "react"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-md bg-[#F5F0E1] border border-[#D2B48C] px-3 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] ${className}`}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"


