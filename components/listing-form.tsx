"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { createListing, updateListing } from "@/lib/actions/listings"
import { ImageUpload } from "@/components/image-upload"
import { Loader2 } from "lucide-react"

interface ListingFormProps {
  initialData?: any
  isEditing?: boolean
}

export function ListingForm({ initialData, isEditing = false }: ListingFormProps) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Array<{id: string, image_url: string, is_cover: boolean}>>(
    initialData?.images || []
  )
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      nightly_price: parseFloat(formData.get("nightly_price") as string),
      max_guests: parseInt(formData.get("max_guests") as string),
      bedrooms: parseInt(formData.get("bedrooms") as string),
      bathrooms: parseInt(formData.get("bathrooms") as string),
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      address_line1: formData.get("address_line1") as string,
      image_url: formData.get("image_url") as string,
    }

    const result = isEditing && initialData?.id
      ? await updateListing(initialData.id, data)
      : await createListing(data)

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
      setLoading(false)
      return
    }

    toast({
      title: "Success!",
      description: isEditing ? "Your listing has been updated." : "Your listing has been created.",
    })

    router.push("/dashboard/lister")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Luxury Villa with Ocean View"
                defaultValue={initialData?.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your property, its features, and what makes it special..."
                rows={6}
                defaultValue={initialData?.description}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Pricing & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nightly_price">Nightly Price (USD) *</Label>
              <Input
                id="nightly_price"
                name="nightly_price"
                type="number"
                min="1"
                step="0.01"
                placeholder="500"
                defaultValue={initialData?.nightly_price}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_guests">Maximum Guests *</Label>
              <Input
                id="max_guests"
                name="max_guests"
                type="number"
                min="1"
                placeholder="6"
                defaultValue={initialData?.max_guests}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                placeholder="3"
                defaultValue={initialData?.bedrooms}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                placeholder="2"
                defaultValue={initialData?.bathrooms}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address_line1">Street Address *</Label>
              <Input
                id="address_line1"
                name="address_line1"
                placeholder="123 Beach Road"
                defaultValue={initialData?.address_line1}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Malibu"
                  defaultValue={initialData?.city}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  defaultValue={initialData?.country}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Images */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Property Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload images directly from your device or use image URLs
              </p>
            </div>
            
            {/* File Upload Section */}
            {isEditing ? (
              <ImageUpload
                listingId={initialData?.id}
                existingImages={initialData?.images || []}
                onImagesChange={setImages}
              />
            ) : (
              <div className="space-y-3">
                <div className="p-4 border-2 border-dashed border-primary/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    📸 Image uploads available after creating the listing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For now, you can add an image URL below
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use URLs from Unsplash, Cloudinary, or any image hosting service
                  </p>
                </div>
              </div>
            )}
            
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                💡 Tip: Upload high-quality images (up to 5MB each) to showcase your property
              </p>
            )}
          </div>

          <Separator />

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="gold-gradient"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Listing" : "Create Listing")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

