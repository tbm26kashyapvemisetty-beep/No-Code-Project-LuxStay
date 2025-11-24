"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { UserRole } from "@/lib/types"
import { Home, User } from "lucide-react"

interface RoleSwitcherProps {
  currentRole: UserRole
  userId: string
}

export function RoleSwitcher({ currentRole, userId }: RoleSwitcherProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function switchRole(newRole: UserRole) {
    if (newRole === currentRole) {
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId)

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
      title: "Role Updated!",
      description: `You are now a ${newRole}.`,
    })

    // Redirect based on new role
    if (newRole === "lister") {
      router.push("/dashboard/lister")
    } else {
      router.push("/dashboard/guest")
    }
    router.refresh()
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant={currentRole === "guest" ? "default" : "outline"}
        className={currentRole === "guest" ? "gold-gradient" : ""}
        onClick={() => switchRole("guest")}
        disabled={loading || currentRole === "guest"}
      >
        <User className="h-4 w-4 mr-2" />
        Guest Mode
      </Button>
      <Button
        variant={currentRole === "lister" ? "secondary" : "outline"}
        onClick={() => switchRole("lister")}
        disabled={loading || currentRole === "lister"}
      >
        <Home className="h-4 w-4 mr-2" />
        Host Mode
      </Button>
    </div>
  )
}

