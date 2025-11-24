export type UserRole = "guest" | "lister" | "admin"
export type BookingStatus = "pending" | "confirmed" | "cancelled"

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Listing {
  id: string
  owner_id: string
  title: string
  description: string
  nightly_price: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  city: string
  country: string
  address_line1: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  is_cover: boolean
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  icon: string | null
  created_at: string
}

export interface ListingAmenity {
  listing_id: string
  amenity_id: string
}

export interface Booking {
  id: string
  listing_id: string
  guest_id: string
  check_in: string
  check_out: string
  total_price: number
  status: BookingStatus
  created_at: string
}

export interface Favorite {
  guest_id: string
  listing_id: string
}

// Extended types with relations
export interface ListingWithDetails extends Listing {
  images: ListingImage[]
  amenities: Amenity[]
  owner: Profile
}

export interface BookingWithDetails extends Booking {
  listing: Listing & { images: ListingImage[] }
  guest: Profile
}

