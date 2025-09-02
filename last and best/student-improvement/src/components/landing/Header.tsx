"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      {/* Main navigation */}
      <nav className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#22C1A3] to-[#ADD8E6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <span className="text-white font-bold text-xl">StudyFlow</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="#support" className="text-gray-300 hover:text-white transition-colors">
              Support
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#22C1A3] hover:bg-[#1ea085] text-white">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}