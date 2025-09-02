"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, signUp as authSignUp, signIn as authSignIn, signInWithGoogle as authSignInWithGoogle, logout as authLogout } from '../services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => { throw new Error('Not implemented') },
  signIn: async () => { throw new Error('Not implemented') },
  signInWithGoogle: async () => { throw new Error('Not implemented') },
  logout: async () => { throw new Error('Not implemented') }
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    return await authSignUp(email, password, name || 'Student')
  }

  const signIn = async (email: string, password: string) => {
    return await authSignIn(email, password)
  }

  const signInWithGoogle = async () => {
    return await authSignInWithGoogle()
  }

  const logout = async () => {
    return await authLogout()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}