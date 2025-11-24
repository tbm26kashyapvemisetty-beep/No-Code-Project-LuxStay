import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { ListingForm } from "@/components/listing-form"

export default async function NewListingPage() {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  if (!user || !profile) {
    redirect("/login")
  }

  if (profile.role !== "lister" && profile.role !== "admin") {
    redirect("/dashboard/guest")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Listing</h1>
            <p className="text-muted-foreground text-lg">
              Share your luxury property with travelers worldwide
            </p>
          </div>

          <ListingForm />
        </div>
      </main>
    </div>
  )
}

