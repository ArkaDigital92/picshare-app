'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import LogoutButton from '@/components/LogoutButton'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to PicShare</h1>
          <p className="mb-8">Please log in or sign up to continue</p>
          <div className="space-x-4">
            <a 
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login
            </a>
            <a 
              href="/signup"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </a>
          </div>
          <p className="mt-8">
            <a href="/test-supabase" className="text-blue-500 hover:underline">
              Test Supabase Connection
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">PicShare</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.email}</span>
          <LogoutButton />
        </div>
      </header>
      
      <main>
        <div className="text-center">
          <h2 className="text-2xl mb-4">You are successfully logged in!</h2>
          <p className="mb-8">This is where your PicShare app content will go.</p>
          
          <div className="space-y-4">
            <p>Your user ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>
              <a href="/test-supabase" className="text-blue-500 hover:underline">
                Test Supabase Connection
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
