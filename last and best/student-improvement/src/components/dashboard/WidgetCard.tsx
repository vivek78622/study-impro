"use client"

import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface WidgetCardProps {
  title: string
  metric: string | number
  subtitle: string
  icon: LucideIcon
  href: string
  loading?: boolean
  children?: React.ReactNode
}

export default function WidgetCard({ 
  title, 
  metric, 
  subtitle, 
  icon: Icon, 
  href, 
  loading = false,
  children 
}: WidgetCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {children}
        </CardContent>
      </Card>
    </Link>
  )
}