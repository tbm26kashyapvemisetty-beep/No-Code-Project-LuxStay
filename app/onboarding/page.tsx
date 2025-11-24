"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Sparkles, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"guest" | "lister" | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function handleRoleSelection(role: "guest" | "lister") {
    setLoading(true)
    setSelectedRole(role)

    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    // Upsert profile with role
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: user.user_metadata.full_name,
        role: role,
      })

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      setLoading(false)
      return
    }

    toast({
      title: "Welcome to LuxeStay!",
      description: `You're all set as a ${role}.`,
    })

    // Redirect based on role
    if (role === "lister") {
      router.push("/dashboard/lister")
    } else {
      router.push("/listings")
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 luxury-gradient">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to LuxeStay!</CardTitle>
          <CardDescription className="text-base">
            How would you like to use LuxeStay?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          <button
            onClick={() => handleRoleSelection("guest")}
            disabled={loading}
            className="group"
          >
            <Card className="h-full border-2 hover:border-primary transition-all duration-200 hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">I'm a Guest</h3>
                <p className="text-muted-foreground text-center">
                  Discover and book luxury properties around the world
                </p>
                <Button
                  className="w-full gold-gradient"
                  disabled={loading && selectedRole === "guest"}
                >
                  {loading && selectedRole === "guest" ? "Setting up..." : "Continue as Guest"}
                </Button>
              </CardContent>
            </Card>
          </button>

          <button
            onClick={() => handleRoleSelection("lister")}
            disabled={loading}
            className="group"
          >
            <Card className="h-full border-2 hover:border-primary transition-all duration-200 hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Home className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold">I'm a Host</h3>
                <p className="text-muted-foreground text-center">
                  List your luxury property and welcome guests
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={loading && selectedRole === "lister"}
                >
                  {loading && selectedRole === "lister" ? "Setting up..." : "Continue as Host"}
                </Button>
              </CardContent>
            </Card>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

