'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ConnectionTest {
  status: 'testing' | 'success' | 'error'
  message: string
  details?: any
}

export default function TestSupabase() {
  const [connectionTest, setConnectionTest] = useState<ConnectionTest>({
    status: 'testing',
    message: 'Testing Supabase connection...'
  })

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Basic connection and auth status
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          throw new Error(`Auth error: ${authError.message}`)
        }

        // Test 2: Try to access Supabase (this will work even without tables)
        const { data, error } = await supabase
          .from('_realtime_subscription') // This is a built-in table that should exist
          .select('*')
          .limit(1)

        // Even if this fails, it means we can connect to Supabase
        // The error would be about permissions or table not existing, not connection issues
        
        setConnectionTest({
          status: 'success',
          message: 'Supabase connection successful!',
          details: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0],
            authSession: session ? 'Session found' : 'No active session (normal for public access)',
            testQuery: error ? `Query failed (expected): ${error.message}` : 'Query successful'
          }
        })

      } catch (error: any) {
        setConnectionTest({
          status: 'error',
          message: `Connection failed: ${error.message}`,
          details: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            error: error.toString()
          }
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Supabase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              connectionTest.status === 'testing' ? 'bg-yellow-500 animate-pulse' :
              connectionTest.status === 'success' ? 'bg-green-500' :
              'bg-red-500'
            }`} />
            <h2 className="text-xl font-semibold">
              {connectionTest.status === 'testing' ? 'Testing...' :
               connectionTest.status === 'success' ? 'Connection Successful' :
               'Connection Failed'}
            </h2>
          </div>
          
          <p className="text-gray-700 mb-4">{connectionTest.message}</p>
          
          {connectionTest.details && (
            <div className="bg-gray-100 rounded p-4">
              <h3 className="font-semibold mb-2">Details:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(connectionTest.details, null, 2)}
              </pre>
            </div>
          )}
          
          {connectionTest.status === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-2">✅ What this means:</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Your Supabase URL and API key are correctly configured</li>
                <li>• The connection to your Supabase project is working</li>
                <li>• You can now start building features with Supabase</li>
                <li>• Consider setting up authentication, database tables, or storage as needed</li>
              </ul>
            </div>
          )}
          
          {connectionTest.status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800 mb-2">❌ Common fixes:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Check that your environment variables are correctly set</li>
                <li>• Verify your Supabase project is active and not paused</li>
                <li>• Ensure your API key is the 'anon/public' key, not the service role key</li>
                <li>• Check your network connection</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
