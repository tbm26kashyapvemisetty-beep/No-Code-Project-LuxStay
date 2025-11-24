"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "./auth"

export async function toggleFavorite(listingId: string) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in to favorite listings" }
  }

  const supabase = await createClient()

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("*")
    .eq("guest_id", user.id)
    .eq("listing_id", listingId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("guest_id", user.id)
      .eq("listing_id", listingId)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Add favorite
    const { error } = await supabase
      .from("favorites")
      .insert({
        guest_id: user.id,
        listing_id: listingId,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath("/listings")
  revalidatePath(`/listings/${listingId}`)
  revalidatePath("/dashboard/guest")

  return { success: true }
}

