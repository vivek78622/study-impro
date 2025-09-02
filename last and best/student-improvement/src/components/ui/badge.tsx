import * as React from "react"

type BadgeVariant = "default" | "outline"

export function Badge({ className = "", children, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const styles =
    variant === "outline"
      ? "bg-white text-gray-800 border border-[#D2B48C]"
      : "bg-[#C1E1C1] text-gray-800"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles} ${className}`} {...props}>
      {children}
    </span>
  )
}


