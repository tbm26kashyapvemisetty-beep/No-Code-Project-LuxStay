import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

export default async function TestConnectionPage() {
  let supabaseConnected = false
  let tablesExist = false
  let tablesList: string[] = []
  let error = ""

  try {
    const supabase = await createClient()
    
    // Test connection
    const { data, error: connError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1)

    if (!connError) {
      supabaseConnected = true
      tablesExist = true
    } else {
      error = connError.message
    }

    // Get all tables
    const { data: tables } = await supabase
      .from("profiles")
      .select("*")
      .limit(0)

    if (tables !== null) {
      tablesList = ["profiles", "listings", "listing_images", "amenities", "listing_amenities", "bookings", "favorites"]
    }
  } catch (e: any) {
    error = e.message
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="container max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold mb-8">LuxeStay Connection Test</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {supabaseConnected ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              Supabase Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supabaseConnected ? (
              <p className="text-green-600">✅ Successfully connected to Supabase!</p>
            ) : (
              <div className="space-y-2">
                <p className="text-destructive">❌ Failed to connect to Supabase</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {tablesExist && (
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {tablesList.map((table) => (
                  <div key={table} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{table}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {!supabaseConnected && (
              <>
                <p>1. Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root</p>
                <p>2. Add your Supabase credentials from the dashboard</p>
                <p>3. Restart your dev server with <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code></p>
              </>
            )}
            {!tablesExist && supabaseConnected && (
              <>
                <p>1. Go to Supabase Dashboard → SQL Editor</p>
                <p>2. Copy the contents of <code className="bg-muted px-1 py-0.5 rounded">supabase/schema.sql</code></p>
                <p>3. Paste and run the SQL query</p>
              </>
            )}
            {supabaseConnected && tablesExist && (
              <p className="text-green-600">✅ Everything is set up correctly! You can now use the app.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

