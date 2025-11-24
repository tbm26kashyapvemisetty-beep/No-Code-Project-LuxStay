import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { getGuestBookings } from "@/lib/actions/bookings"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Heart, MapPin, Sparkles } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"
import { PriceDisplay } from "@/components/price-display"

async function getFavorites(userId: string) {
  const supabase = await createClient()

  const { data: favorites } = await supabase
    .from("favorites")
    .select(`
      *,
      listing:listings(
        *,
        images:listing_images(*)
      )
    `)
    .eq("guest_id", userId)

  return favorites || []
}

export default async function GuestDashboardPage() {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  if (!user || !profile) {
    redirect("/login")
  }

  if (profile.role !== "guest" && profile.role !== "admin") {
    redirect("/dashboard/lister")
  }

  const bookings = await getGuestBookings(user.id)
  const favorites = await getFavorites(user.id)

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.check_in) >= new Date() && b.status !== "cancelled"
  )
  
  const pastBookings = bookings.filter(
    (b) => new Date(b.check_out) < new Date() || b.status === "cancelled"
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile.full_name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your bookings and explore your favorites
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past">Past Trips</TabsTrigger>
            <TabsTrigger value="favorites" id="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                  <p className="text-muted-foreground mb-4">
                    Start planning your next luxury getaway
                  </p>
                  <Button asChild className="gold-gradient">
                    <Link href="/listings">Explore Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingBookings.map((booking) => {
                  const coverImage = booking.listing?.images?.find((img: any) => img.is_cover) || booking.listing?.images?.[0]

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="grid md:grid-cols-[300px_1fr] gap-6">
                        <Link href={`/listings/${booking.listing_id}`} className="relative h-48 md:h-auto overflow-hidden bg-muted">
                          {coverImage?.image_url ? (
                            <SafeImage
                              src={coverImage.image_url}
                              alt={booking.listing?.title || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <Sparkles className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                        </Link>

                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/listings/${booking.listing_id}`}>
                                <h3 className="font-semibold text-xl hover:text-primary transition-colors">
                                  {booking.listing?.title}
                                </h3>
                              </Link>
                              <p className="text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.listing?.city}, {booking.listing?.country}
                              </p>
                            </div>
                            <Badge
                              variant={booking.status === "confirmed" ? "default" : "secondary"}
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Check-in:</span>{" "}
                              <span className="font-medium">{formatDate(booking.check_in)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Check-out:</span>{" "}
                              <span className="font-medium">{formatDate(booking.check_out)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <span className="text-sm text-muted-foreground">Total Price</span>
                              <p className="text-2xl font-bold"><PriceDisplay amount={booking.total_price} /></p>
                            </div>
                            <Button variant="outline" asChild>
                              <Link href={`/listings/${booking.listing_id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past trips</h3>
                  <p className="text-muted-foreground">
                    Your travel history will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastBookings.map((booking) => {
                  const coverImage = booking.listing?.images?.find((img: any) => img.is_cover) || booking.listing?.images?.[0]

                  return (
                    <Card key={booking.id} className="overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <div className="grid md:grid-cols-[200px_1fr] gap-4">
                        <Link href={`/listings/${booking.listing_id}`} className="relative h-32 md:h-auto overflow-hidden bg-muted">
                          {coverImage?.image_url ? (
                            <SafeImage
                              src={coverImage.image_url}
                              alt={booking.listing?.title || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <Sparkles className="h-8 w-8 text-primary/40" />
                            </div>
                          )}
                        </Link>

                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/listings/${booking.listing_id}`}>
                                <h3 className="font-semibold hover:text-primary transition-colors">
                                  {booking.listing?.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                              </p>
                            </div>
                            <Badge variant={booking.status === "cancelled" ? "destructive" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium"><PriceDisplay amount={booking.total_price} /></p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save your favorite properties to find them easily later
                  </p>
                  <Button asChild className="gold-gradient">
                    <Link href="/listings">Explore Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => {
                  const listing = fav.listing
                  const coverImage = listing?.images?.find((img: any) => img.is_cover) || listing?.images?.[0]

                  return (
                    <Link key={fav.listing_id} href={`/listings/${fav.listing_id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48 bg-muted">
                          {coverImage?.image_url ? (
                            <SafeImage
                              src={coverImage.image_url}
                              alt={listing?.title || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <Sparkles className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1">
                            {listing?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing?.city}, {listing?.country}
                          </p>
                          <p className="font-semibold">
                            <PriceDisplay amount={listing?.nightly_price || 0} showPerNight />
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

