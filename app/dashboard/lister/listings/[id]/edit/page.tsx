import { notFound, redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/server"
import { ListingForm } from "@/components/listing-form"

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Get the listing with images and amenities
  const { data: listing } = await supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*),
      amenities:listing_amenities(
        amenity:amenities(*)
      )
    `)
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (!listing) {
    notFound()
  }

  // Transform the data to match the form structure
  const listingData = {
    ...listing,
    amenity_ids: listing.amenities?.map((a: any) => a.amenity.id) || [],
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
        <p className="text-muted-foreground">
          Update your property details and amenities
        </p>
      </div>

      <ListingForm initialData={listingData} isEditing />
    </div>
  )
}

