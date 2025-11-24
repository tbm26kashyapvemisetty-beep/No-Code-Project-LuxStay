import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Plus, Calendar, DollarSign, MapPin, Sparkles } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { BookingStatusButton } from "@/components/booking-status-button"
import { SafeImage } from "@/components/safe-image"
import { PriceDisplay } from "@/components/price-display"

async function getListerData(userId: string) {
  const supabase = await createClient()

  // Get listings
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*)
    `)
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })

  // Get bookings for lister's properties
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      guest:profiles!guest_id(*),
      listing:listings!listing_id(
        id,
        title,
        city,
        country,
        images:listing_images(*)
      )
    `)
    .in("listing_id", listings?.map((l) => l.id) || [])
    .order("created_at", { ascending: false })

  return {
    listings: listings || [],
    bookings: bookings || [],
  }
}

export default async function ListerDashboardPage() {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  if (!user || !profile) {
    redirect("/login")
  }

  if (profile.role !== "lister" && profile.role !== "admin") {
    redirect("/dashboard/guest")
  }

  const { listings, bookings } = await getListerData(user.id)

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.check_in) >= new Date() && b.status === "confirmed"
  )

  // Calculate stats
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + parseFloat(b.total_price.toString()), 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your properties and bookings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{listings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold"><PriceDisplay amount={totalRevenue} /></div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Properties</h2>
              <Button asChild className="gold-gradient">
                <Link href="/dashboard/lister/listings/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Listing
                </Link>
              </Button>
            </div>

            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first listing to start hosting
                  </p>
                  <Button asChild className="gold-gradient">
                    <Link href="/dashboard/lister/listings/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => {
                  const coverImage = listing.images?.find((img: any) => img.is_cover) || listing.images?.[0]
                  const listingBookings = bookings.filter((b) => b.listing_id === listing.id)

                  return (
                    <Card key={listing.id} className="overflow-hidden">
                      <Link href={`/listings/${listing.id}`} className="relative block h-48 bg-muted overflow-hidden">
                        {coverImage?.image_url ? (
                          <SafeImage
                            src={coverImage.image_url}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <Sparkles className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        {listing.featured && (
                          <Badge className="absolute top-3 right-3 gold-gradient z-10">
                            Featured
                          </Badge>
                        )}
                      </Link>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.city}, {listing.country}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold"><PriceDisplay amount={listing.nightly_price} showPerNight /></span>
                          <span className="text-muted-foreground">
                            {listingBookings.length} bookings
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/dashboard/lister/listings/${listing.id}/edit`}>
                            Edit Listing
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {pendingBookings.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Pending Requests</h2>
                {pendingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{booking.listing?.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Guest: {booking.guest?.full_name}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>{formatDate(booking.check_in)}</span>
                            <span>→</span>
                            <span>{formatDate(booking.check_out)}</span>
                          </div>
                          <p className="font-semibold mt-2"><PriceDisplay amount={booking.total_price} /></p>
                        </div>
                        <div className="flex gap-2">
                          <BookingStatusButton bookingId={booking.id} action="confirm" />
                          <BookingStatusButton bookingId={booking.id} action="cancel" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">All Bookings</h2>
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">
                      Your booking requests will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold">{booking.listing?.title}</h4>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {booking.guest?.full_name} · {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold"><PriceDisplay amount={booking.total_price} /></p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

