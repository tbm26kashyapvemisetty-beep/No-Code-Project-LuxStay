"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "./auth"

interface CreateBookingData {
  listingId: string
  checkIn: string
  checkOut: string
  totalPrice: number
}

export async function createBooking(data: CreateBookingData) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in to create a booking" }
  }

  const supabase = await createClient()

  // Check for overlapping bookings using the database function
  const { data: hasOverlap } = await supabase
    .rpc("check_booking_overlap", {
      p_listing_id: data.listingId,
      p_check_in: data.checkIn,
      p_check_out: data.checkOut,
    })

  if (hasOverlap) {
    return { error: "These dates are no longer available. Please select different dates." }
  }

  // Create the booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      listing_id: data.listingId,
      guest_id: user.id,
      check_in: data.checkIn,
      check_out: data.checkOut,
      total_price: data.totalPrice,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Booking error:", error)
    return { error: error.message }
  }

  revalidatePath(`/listings/${data.listingId}`)
  revalidatePath("/dashboard/guest")
  revalidatePath("/dashboard/lister")

  return { success: true, booking }
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "cancelled") {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = await createClient()

  // Verify user has permission to update this booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, listing:listings(owner_id)")
    .eq("id", bookingId)
    .single()

  if (!booking) {
    return { error: "Booking not found" }
  }

  // Check if user is the guest or the listing owner
  const isGuest = booking.guest_id === user.id
  const isOwner = booking.listing?.owner_id === user.id

  if (!isGuest && !isOwner) {
    return { error: "You don't have permission to update this booking" }
  }

  // Update the booking
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/guest")
  revalidatePath("/dashboard/lister")

  return { success: true }
}

export async function getGuestBookings(userId: string) {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      listing:listings(
        *,
        images:listing_images(*)
      )
    `)
    .eq("guest_id", userId)
    .order("created_at", { ascending: false })

  return bookings || []
}

export async function getListerBookings(userId: string) {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      guest:profiles!guest_id(*),
      listing:listings!listing_id(
        *,
        images:listing_images(*)
      )
    `)
    .eq("listing.owner_id", userId)
    .order("created_at", { ascending: false })

  return bookings || []
}

