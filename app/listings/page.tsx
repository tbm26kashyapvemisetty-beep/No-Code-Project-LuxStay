import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { ListingsGrid } from "@/components/listings-grid"
import { ListingsFilters } from "@/components/listings-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null
  const params = await searchParams

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Luxury Stays</h1>
          <p className="text-muted-foreground text-lg">
            Discover premium properties tailored to your preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside>
            <Suspense fallback={<Skeleton className="h-[600px]" />}>
              <ListingsFilters />
            </Suspense>
          </aside>

          <div>
            <Suspense fallback={<LoadingGrid />}>
              <ListingsGrid searchParams={params} userId={user?.id} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

