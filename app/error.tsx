'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isSupabaseError = error.message.includes('Supabase')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            {isSupabaseError
              ? 'Supabase configuration error'
              : 'An error occurred while loading the page'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupabaseError && (
            <div className="bg-destructive/10 p-4 rounded-md text-sm">
              <p className="font-semibold mb-2">Missing Supabase credentials</p>
              <p className="text-muted-foreground mb-2">
                Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file with:
              </p>
              <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key`}
              </pre>
            </div>
          )}
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

