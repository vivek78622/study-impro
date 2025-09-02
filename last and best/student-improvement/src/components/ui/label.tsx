import * as React from "react"

export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const combinedClassName = className ? `text-sm font-medium text-gray-700 ${className}` : "text-sm font-medium text-gray-700"
  return <label className={combinedClassName} {...props} />
}


