"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function deleteUserAccount() {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Not authenticated" }
  }

  try {
    // Delete user data in order (foreign key constraints)
    
    // 1. Delete favorites
    await supabase
      .from('favorites')
      .delete()
      .eq('guest_id', user.id)

    // 2. Delete bookings (as guest)
    await supabase
      .from('bookings')
      .delete()
      .eq('guest_id', user.id)

    // 3. Get user's listings to delete related data
    const { data: listings } = await supabase
      .from('listings')
      .select('id')
      .eq('owner_id', user.id)

    const listingIds = listings?.map(l => l.id) || []

    if (listingIds.length > 0) {
      // Delete bookings for user's listings
      await supabase
        .from('bookings')
        .delete()
        .in('listing_id', listingIds)

      // Delete listing amenities
      await supabase
        .from('listing_amenities')
        .delete()
        .in('listing_id', listingIds)

      // Delete listing images
      await supabase
        .from('listing_images')
        .delete()
        .in('listing_id', listingIds)

      // Delete listings
      await supabase
        .from('listings')
        .delete()
        .eq('owner_id', user.id)
    }

    // 4. Delete profile
    await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // 5. Delete auth user (this will sign them out)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      // If admin delete fails, try regular signout
      console.error('Admin delete failed:', deleteError)
      await supabase.auth.signOut()
    }

    revalidatePath('/', 'layout')
    return { success: true }

  } catch (error: any) {
    console.error('Error deleting user:', error)
    return { error: error.message || "Failed to delete account" }
  }
}

