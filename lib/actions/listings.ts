"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "./auth"

interface CreateListingData {
  title: string
  description: string
  nightly_price: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  city: string
  country: string
  address_line1: string
  image_url?: string
}

export async function createListing(data: CreateListingData) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in to create a listing" }
  }

  const supabase = await createClient()

  // Verify user is a lister
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || (profile.role !== "lister" && profile.role !== "admin")) {
    return { error: "You must be a host to create listings" }
  }

  // Create the listing
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      title: data.title,
      description: data.description,
      nightly_price: data.nightly_price,
      max_guests: data.max_guests,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      city: data.city,
      country: data.country,
      address_line1: data.address_line1,
    })
    .select()
    .single()

  if (listingError) {
    return { error: listingError.message }
  }

  // Add image if provided
  if (data.image_url && listing) {
    await supabase
      .from("listing_images")
      .insert({
        listing_id: listing.id,
        image_url: data.image_url,
        is_cover: true,
      })
  }

  revalidatePath("/dashboard/lister")
  revalidatePath("/listings")
  revalidatePath("/")

  return { success: true, listing }
}

export async function updateListing(listingId: string, data: Partial<CreateListingData>) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single()

  if (!listing || listing.owner_id !== user.id) {
    return { error: "You don't have permission to edit this listing" }
  }

  // Remove image_url from data as it's stored in listing_images table
  const { image_url, ...listingData } = data

  // Update the listing
  const { error } = await supabase
    .from("listings")
    .update(listingData)
    .eq("id", listingId)

  if (error) {
    return { error: error.message }
  }

  // Update cover image if provided
  if (image_url) {
    // First, remove is_cover from existing images
    await supabase
      .from("listing_images")
      .update({ is_cover: false })
      .eq("listing_id", listingId)

    // Check if this URL already exists
    const { data: existingImage } = await supabase
      .from("listing_images")
      .select("id")
      .eq("listing_id", listingId)
      .eq("image_url", image_url)
      .single()

    if (existingImage) {
      // Update existing image to be cover
      await supabase
        .from("listing_images")
        .update({ is_cover: true })
        .eq("id", existingImage.id)
    } else {
      // Add new cover image
      await supabase
        .from("listing_images")
        .insert({
          listing_id: listingId,
          image_url: image_url,
          is_cover: true,
        })
    }
  }

  revalidatePath(`/listings/${listingId}`)
  revalidatePath("/dashboard/lister")

  return { success: true }
}

export async function deleteListing(listingId: string) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single()

  if (!listing || listing.owner_id !== user.id) {
    return { error: "You don't have permission to delete this listing" }
  }

  // Delete the listing (images will cascade)
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/lister")
  revalidatePath("/listings")

  return { success: true }
}

