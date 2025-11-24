import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { RoleSwitcher } from "@/components/role-switcher"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { CurrencySelector } from "@/components/currency-selector"

export default async function ProfilePage() {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  if (!user || !profile) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground text-lg">
              Manage your account settings
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{profile.full_name || "No name set"}</p>
                  <Badge variant={profile.role === "guest" ? "default" : "secondary"} className="mt-1">
                    {profile.role === "guest" ? "Guest Account" : "Host Account"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                  <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Current Role:</span>
                  <span className="capitalize font-medium">{profile.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Switch Account Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can switch between Guest and Host modes at any time.
              </p>
              <RoleSwitcher currentRole={profile.role} userId={user.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencySelector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.role === "guest" ? (
                <>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/dashboard/guest">View My Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/listings">Browse Properties</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/dashboard/lister">View My Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link href="/dashboard/lister/listings/new">Create New Listing</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <DeleteAccountDialog userEmail={user.email || ""} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

