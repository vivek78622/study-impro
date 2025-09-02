"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SocialButton from "@/components/SocialButton"
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { signUp, signIn } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name')
          setIsLoading(false)
          return
        }
        await signUp(email, password, name)
      } else {
        await signIn(email, password)
      }
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.')
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.')
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Account exists! Switched to Sign In mode. Please sign in with your password.')
        setIsSignUp(false) // Auto-switch to sign in mode
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <button className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-black hover:text-gray-600 transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </header>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side decorations */}
        <div className="absolute left-20 top-1/3 w-16 h-12 border-2 border-black rounded transform -rotate-12 hidden md:block" />
        <div className="absolute left-32 top-1/2 w-20 h-16 bg-[#F4D03F] rounded-lg grid grid-cols-4 gap-1 p-2 transform rotate-12 hidden md:block">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-black rounded-full" />
          ))}
        </div>
        <svg className="absolute left-16 bottom-1/3 w-24 h-16 hidden md:block" viewBox="0 0 100 60">
          <path d="M10 30 Q 30 10, 50 30 T 90 30" stroke="black" strokeWidth="2" fill="none" />
        </svg>

        {/* Right side decorations */}
        <div className="absolute right-20 top-1/4 w-20 h-16 bg-[#F4D03F] rounded-lg grid grid-cols-4 gap-1 p-2 transform -rotate-6 hidden md:block">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-black rounded-full" />
          ))}
        </div>
        <div className="absolute right-32 bottom-1/3 w-16 h-12 border-2 border-black rounded transform rotate-12 hidden md:block" />
        
        {/* Person illustration */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="w-32 h-40 bg-black rounded-t-full relative">
            <div className="absolute top-8 left-4 w-24 h-24 bg-[#F4B566] rounded-lg transform rotate-12" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-black rounded-t-lg" />
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-400">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">{isSignUp ? 'Create Account' : 'Agent Login'}</h2>
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Enter your details to create a new account' : 'Hey, Enter your details to get sign in to your account'}
            </p>
            
            {/* Toggle between Sign In and Sign Up */}
            <div className="mt-4 flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#F4B566] focus:ring-1 focus:ring-[#F4B566] outline-none transition-colors"
                  required={isSignUp}
                />
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#F4B566] focus:ring-1 focus:ring-[#F4B566] outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:border-[#F4B566] focus:ring-1 focus:ring-[#F4B566] outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="text-right">
              <button type="button" className="text-sm text-gray-600 hover:text-black transition-colors">
                Having trouble in sign in?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F4B566] hover:bg-[#F4B566]/90 hover:scale-[1.02] text-black font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-sm text-gray-500">Or Sign in with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="flex justify-center">
            <SocialButton provider="google" />
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-black font-medium hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600">
        Copyright @wework 2022 | Privacy Policy
      </footer>
    </div>
  )
}