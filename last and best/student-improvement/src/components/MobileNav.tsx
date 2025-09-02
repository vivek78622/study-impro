"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Calendar, Target, BookOpen, DollarSign, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/habits', icon: Target, label: 'Habits' },
  { href: '/assignments', icon: BookOpen, label: 'Assignments' },
  { href: '/budget', icon: DollarSign, label: 'Budget' },
  { href: '/profile', icon: User, label: 'Profile' }
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D2B48C]/20 md:hidden z-50">
      <div className="grid grid-cols-7 gap-1 p-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#C1E1C1] text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}