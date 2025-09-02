"use client"

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

interface UserDropdownProps {
  user: any
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-700">
              {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : user?.email?.[0]?.toUpperCase() || 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="font-medium text-sm">{user?.displayName || user?.email?.split('@')[0] || 'Student'}</p>
            <p className="text-xs text-gray-500">Student Plan</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent open={open}>
        <Link href="/profile">
          <DropdownMenuItem onClick={() => setOpen(false)}>
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}