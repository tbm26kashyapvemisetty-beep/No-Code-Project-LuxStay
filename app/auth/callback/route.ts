import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // Get the user to check if they need onboarding
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // If there's a next parameter (like password reset), go there
      if (next && next !== '/') {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // If no profile or no role set, go to onboarding
      if (!profile || !profile.role) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Otherwise go to home
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(`${origin}/`)
}

