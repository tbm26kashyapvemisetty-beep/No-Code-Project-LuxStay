import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Bed, Bath, Sparkles } from "lucide-react"
import { BookingWidget } from "@/components/booking-widget"
import { FavoriteButton } from "@/components/favorite-button"
import { SafeImage } from "@/components/safe-image"
import { ImageGallery } from "@/components/image-gallery"
import { PriceDisplay } from "@/components/price-display"

async function getListing(id: string, userId?: string) {
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*),
      amenities:listing_amenities(amenity:amenities(*)),
      owner:profiles!owner_id(*),
      favorites:favorites(guest_id)
    `)
    .eq("id", id)
    .single()

  if (!listing) return null

  // Get bookings for this listing to show unavailable dates
  const { data: bookings } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("listing_id", id)
    .in("status", ["pending", "confirmed"])

  return { ...listing, bookings: bookings || [] }
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const search = await searchParams
  
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null
  const listing = await getListing(id, user?.id)

  if (!listing) {
    notFound()
  }

  // Extract search parameters for booking
  const checkIn = search?.checkIn as string | undefined
  const checkOut = search?.checkOut as string | undefined
  const guests = search?.guests ? Number(search.guests) : undefined

  const coverImage = listing.images?.find((img: any) => img.is_cover) || listing.images?.[0]
  const isFavorited = user && listing.favorites?.some((fav: any) => fav.guest_id === user.id)
  const isOwner = user && listing.owner_id === user.id

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      <main className="flex-1">
        {/* Image Gallery */}
        <div className="container pt-8 relative">
          {listing.featured && (
            <Badge className="absolute top-12 left-12 z-20 gold-gradient text-base px-4 py-2">
              Featured Property
            </Badge>
          )}
          
          {user && !isOwner && (
            <div className="absolute top-12 right-12 z-20">
              <FavoriteButton listingId={listing.id} initialFavorited={!!isFavorited} />
            </div>
          )}
          
          <ImageGallery images={listing.images || []} title={listing.title} />
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Title & Location */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
                <p className="text-lg text-muted-foreground flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {listing.address_line1}, {listing.city}, {listing.country}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.max_guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.bathrooms} bathrooms</span>
                </div>
              </div>

              <Separator />

              {/* Host Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={listing.owner.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {listing.owner.full_name?.charAt(0) || "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Hosted by {listing.owner.full_name || "Host"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Luxury property owner
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">About this property</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((item: any) => (
                      <div key={item.amenity.id} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-primary" />
                        </div>
                        <span>{item.amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {listing.images && listing.images.length > 1 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.images.slice(1, 7).map((image: any) => (
                      <div key={image.id} className="relative h-48 rounded-lg overflow-hidden bg-muted">
                        <SafeImage
                          src={image.image_url}
                          alt="Property image"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Widget */}
            <div className="lg:sticky lg:top-24 h-fit">
              {user && profile?.role === "guest" && !isOwner ? (
                <BookingWidget
                  listingId={listing.id}
                  nightlyPrice={listing.nightly_price}
                  bookedDates={listing.bookings}
                  initialCheckIn={checkIn}
                  initialCheckOut={checkOut}
                  initialGuests={guests}
                />
              ) : isOwner ? (
                <Card className="border-primary/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3 className="font-semibold text-lg">This is your listing</h3>
                    <p className="text-sm text-muted-foreground">
                      You can manage this property from your dashboard.
                    </p>
                  </CardContent>
                </Card>
              ) : user && profile?.role === "lister" ? (
                <Card className="border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold">
                        <PriceDisplay amount={listing.nightly_price} showPerNight />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Switch to Guest mode to book properties
                      </p>
                      <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link href="/profile">View Profile Settings</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold">
                        <PriceDisplay amount={listing.nightly_price} showPerNight />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sign in to book this property
                      </p>
                      <Button asChild className="gold-gradient mt-2">
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

