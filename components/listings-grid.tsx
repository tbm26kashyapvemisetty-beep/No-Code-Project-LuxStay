import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { FavoriteButton } from "@/components/favorite-button"
import { SafeImage } from "@/components/safe-image"
import { PriceDisplay } from "@/components/price-display"

interface ListingsGridProps {
  searchParams: { [key: string]: string | string[] | undefined }
  userId?: string
}

export async function ListingsGrid({ searchParams, userId }: ListingsGridProps) {
  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*),
      favorites:favorites(guest_id)
    `)

  // Apply filters
  const location = searchParams?.location as string
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined
  const guests = searchParams?.guests ? Number(searchParams.guests) : undefined
  const checkIn = searchParams?.checkIn as string
  const checkOut = searchParams?.checkOut as string

  // Build query string for listing links (to preserve search context)
  const linkParams = new URLSearchParams()
  if (checkIn) linkParams.set("checkIn", checkIn)
  if (checkOut) linkParams.set("checkOut", checkOut)
  if (guests) linkParams.set("guests", guests.toString())
  const queryString = linkParams.toString() ? `?${linkParams.toString()}` : ""

  if (location) {
    // Check if location contains comma (e.g., "Mirissa, Sri Lanka")
    if (location.includes(',')) {
      const parts = location.split(',').map(p => p.trim())
      const cityPart = parts[0]
      const countryPart = parts[1] || ''
      
      // Search for both city and country
      query = query.ilike("city", `%${cityPart}%`).ilike("country", `%${countryPart}%`)
    } else {
      // Search in either city or country
      query = query.or(`city.ilike.%${location}%,country.ilike.%${location}%`)
    }
  }

  if (minPrice) {
    query = query.gte("nightly_price", minPrice)
  }

  if (maxPrice) {
    query = query.lte("nightly_price", maxPrice)
  }

  if (guests) {
    query = query.gte("max_guests", guests)
  }

  const { data: listingsData } = await query.order("created_at", { ascending: false })

  // Filter out listings with overlapping bookings if dates are provided
  let listings = listingsData || []
  
  if (checkIn && checkOut && listings.length > 0) {
    // Get all bookings for these listings
    const listingIds = listings.map(l => l.id)
    const { data: bookings } = await supabase
      .from("bookings")
      .select("listing_id, check_in, check_out")
      .in("listing_id", listingIds)
      .in("status", ["pending", "confirmed"])

    // Filter out listings with conflicting bookings
    if (bookings) {
      listings = listings.filter(listing => {
        const listingBookings = bookings.filter(b => b.listing_id === listing.id)
        
        // Check if any booking overlaps with requested dates
        const hasConflict = listingBookings.some(booking => {
          const bookingStart = new Date(booking.check_in)
          const bookingEnd = new Date(booking.check_out)
          const requestStart = new Date(checkIn)
          const requestEnd = new Date(checkOut)
          
          // Check for overlap
          return (
            (requestStart >= bookingStart && requestStart < bookingEnd) ||
            (requestEnd > bookingStart && requestEnd <= bookingEnd) ||
            (requestStart <= bookingStart && requestEnd >= bookingEnd)
          )
        })
        
        return !hasConflict
      })
    }
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to see more results
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        {listings.length} {listings.length === 1 ? "property" : "properties"} found
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const coverImage = listing.images?.find((img: any) => img.is_cover) || listing.images?.[0]
          const isFavorited = userId && listing.favorites?.some((fav: any) => fav.guest_id === userId)

          return (
            <div key={listing.id} className="relative group">
              <Link href={`/listings/${listing.id}${queryString}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 bg-muted overflow-hidden">
                        {coverImage?.image_url ? (
                          <SafeImage
                            src={coverImage.image_url}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <Sparkles className="h-16 w-16 text-primary/40" />
                          </div>
                        )}
                    {listing.featured && (
                      <Badge className="absolute top-4 left-4 gold-gradient">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      {listing.city}, {listing.country}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.max_guests} guests
                      </div>
                    </div>
                    <div className="mt-2 font-semibold text-lg">
                      <PriceDisplay amount={listing.nightly_price} showPerNight />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {userId && (
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton listingId={listing.id} initialFavorited={!!isFavorited} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

