"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "./auth"
import { revalidatePath } from "next/cache"

export async function uploadListingImage(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in to upload images" }
  }

  const file = formData.get('file') as File
  const listingId = formData.get('listingId') as string | null
  const isCover = formData.get('isCover') === 'true'

  if (!file) {
    return { error: "No file provided" }
  }

  const supabase = await createClient()

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2)
    return { error: `File size (${sizeMB}MB) exceeds 5MB limit. Please compress or resize your image.` }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: "Only image files are allowed" }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${listingId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  try {
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: "Failed to upload image" }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName)

    // If listingId is provided, save to database
    if (listingId) {
      const { data: imageRecord, error: dbError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          image_url: publicUrl,
          is_cover: isCover,
        })
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('listing-images').remove([fileName])
        return { error: "Failed to save image record" }
      }

      revalidatePath(`/listings/${listingId}`)
      return { success: true, image: imageRecord }
    }

    // Return URL for temporary uploads (during listing creation)
    return {
      success: true,
      image: {
        id: fileName,
        image_url: publicUrl,
        is_cover: isCover,
      }
    }

  } catch (error) {
    console.error('Upload error:', error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteListingImage(imageId: string, imageUrl: string) {
  const user = await getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = await createClient()

  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/listing-images/')
    const filePath = urlParts[1]

    if (filePath) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('listing-images')
        .remove([filePath])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      return { error: "Failed to delete image record" }
    }

    return { success: true }

  } catch (error) {
    console.error('Delete error:', error)
    return { error: "An unexpected error occurred" }
  }
}

