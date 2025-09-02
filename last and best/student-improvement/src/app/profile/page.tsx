"use client"

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Camera, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    console.log('Saving profile:', { name, email })
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <ProtectedRoute>
      <div className="dashboard-bg min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="outline" className="border-[#D2B48C]/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#0F172A]">Profile Settings</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#C1E1C1] rounded-full flex items-center justify-center text-2xl font-bold text-[#0F172A]">
                    {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : user?.email?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#ADD8E6] hover:bg-[#9BC5E6] p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-[#0F172A]">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-[#D2B48C]/30" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#0F172A]">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white border-[#D2B48C]/30" />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-[#0F172A]">New Password</Label>
                    <Input id="password" type="password" placeholder="Leave blank to keep current" className="bg-white border-[#D2B48C]/30" />
                  </div>
                  <Button onClick={handleSave} className="btn-accent-2">
                    <Save className="w-4 h-4 mr-2" />Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[#0F172A]">Dark Mode</Label>
                      <p className="text-sm text-[#6B7280]">Toggle theme</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <div className="p-4 rounded-lg bg-[#F5F0E1]/50">
                    <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border`}>
                      <p className="font-medium">Sample Card</p>
                      <p className="text-sm opacity-70">Theme preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-red-200">
                <CardContent className="pt-6">
                  <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}