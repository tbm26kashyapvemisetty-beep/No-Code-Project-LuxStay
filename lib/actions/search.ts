"use server"

import { createClient } from "@/lib/supabase/server"

export async function getLocationSuggestions(query: string) {
  if (!query || query.length < 1) {
    return { suggestions: [] }
  }

  const supabase = await createClient()

  // Check if query contains comma (e.g., "Mirissa, Sri Lanka")
  const hasComma = query.includes(',')
  
  let cities
  
  if (hasComma) {
    // Split by comma and trim spaces
    const parts = query.split(',').map(p => p.trim())
    const cityPart = parts[0]
    const countryPart = parts[1] || ''

    // Search for both city and country
    const { data } = await supabase
      .from("listings")
      .select("city, country")
      .ilike("city", `%${cityPart}%`)
      .ilike("country", `%${countryPart}%`)
      .limit(10)
    
    cities = data
  } else {
    // Search in both city and country columns
    const { data } = await supabase
      .from("listings")
      .select("city, country")
      .or(`city.ilike.%${query}%,country.ilike.%${query}%`)
      .limit(10)
    
    cities = data
  }

  if (!cities) {
    return { suggestions: [] }
  }

  // Remove duplicates and format suggestions
  const uniqueLocations = Array.from(
    new Map(
      cities.map(item => [
        `${item.city}, ${item.country}`,
        { city: item.city, country: item.country }
      ])
    ).values()
  )

  return { suggestions: uniqueLocations }
}

export async function searchListings(params: {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*)
    `)
    .order("created_at", { ascending: false })

  // Filter by location (city or country)
  if (params.location) {
    query = query.or(`city.ilike.%${params.location}%,country.ilike.%${params.location}%`)
  }

  // Filter by guest count
  if (params.guests) {
    query = query.gte("max_guests", params.guests)
  }

  const { data: listings } = await query

  return { listings: listings || [] }
}

