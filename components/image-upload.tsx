"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

interface ImageUploadProps {
  listingId?: string
  existingImages?: Array<{
    id: string
    image_url: string
    is_cover: boolean
  }>
  onImagesChange?: (images: Array<{id: string, image_url: string, is_cover: boolean}>) => void
}

export function ImageUpload({ listingId, existingImages = [], onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState(existingImages)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [addingUrl, setAddingUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    console.log('Files selected:', files.length)
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
        })
        return false
      }
      
      // Check file size (5MB limit per file)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 5MB limit. Please compress or resize it.`,
        })
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    // Check total number of images
    if (images.length + validFiles.length > 10) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `Maximum 10 images allowed per listing. You currently have ${images.length}.`,
      })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to upload images",
        })
        setUploading(false)
        return
      }
      
      console.log('Starting upload for user:', user.id)
      console.log('Uploading', validFiles.length, 'files to listing:', listingId)
      
      const uploadedImages = []
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        const isCover = images.length === 0 && i === 0
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${listingId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload directly to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          
          // Check if it's a bucket not found error
          if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
            toast({
              variant: "destructive",
              title: "Storage not configured",
              description: "Please run the storage-setup.sql script in your Supabase SQL Editor first.",
            })
          } else {
            toast({
              variant: "destructive",
              title: "Upload failed",
              description: uploadError.message,
            })
          }
          continue
        }

        console.log('Upload successful:', uploadData)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)

        // Save to database if listingId exists
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
            // Clean up uploaded file
            await supabase.storage.from('listing-images').remove([fileName])
            toast({
              variant: "destructive",
              title: "Database error",
              description: "Failed to save image record",
            })
            continue
          }

          uploadedImages.push(imageRecord)
          console.log('Image saved to database:', imageRecord)
        } else {
          // For temp uploads without listingId
          const tempImage = {
            id: fileName,
            image_url: publicUrl,
            is_cover: isCover,
          }
          uploadedImages.push(tempImage)
          console.log('Temp image created:', tempImage)
        }

        setProgress(((i + 1) / validFiles.length) * 100)
      }

      console.log('Total uploaded images:', uploadedImages.length)
      
      const newImages = [...images, ...uploadedImages]
      setImages(newImages)
      onImagesChange?.(newImages)
      
      console.log('Updated images state:', newImages.length)

      toast({
        title: "Success!",
        description: `${uploadedImages.length} image(s) uploaded successfully`,
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An error occurred while uploading images",
      })
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleRemoveImage(imageId: string, imageUrl: string) {
    try {
      const supabase = createClient()
      
      // Extract file path from URL
      const urlParts = imageUrl.split('/listing-images/')
      const filePath = urlParts[1]

      // Delete from storage if it's a Supabase-hosted file
      if (filePath) {
        await supabase.storage.from('listing-images').remove([filePath])
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('listing_images')
        .delete()
        .eq('id', imageId)

      if (dbError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete image: " + dbError.message,
        })
        return
      }

      const newImages = images.filter(img => img.id !== imageId)
      setImages(newImages)
      onImagesChange?.(newImages)

      toast({
        title: "Image removed",
        description: "The image has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      })
    }
  }

  async function handleSetCover(imageId: string) {
    const newImages = images.map(img => ({
      ...img,
      is_cover: img.id === imageId
    }))
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  async function handleAddUrl() {
    if (!imageUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an image URL",
      })
      return
    }

    // Validate URL format
    try {
      new URL(imageUrl)
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid image URL",
      })
      return
    }

    if (!listingId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Listing ID is required to add images",
      })
      return
    }

    setAddingUrl(true)

    try {
      const supabase = createClient()
      
      // Check if this is the first image
      const isCover = images.length === 0

      // Save to database
      const { data: imageRecord, error: dbError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          image_url: imageUrl,
          is_cover: isCover,
        })
        .select()
        .single()

      if (dbError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add image: " + dbError.message,
        })
        setAddingUrl(false)
        return
      }

      const newImages = [...images, imageRecord]
      setImages(newImages)
      onImagesChange?.(newImages)
      setImageUrl("")

      toast({
        title: "Success!",
        description: "Image URL added successfully",
      })

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setAddingUrl(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || addingUrl}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... {Math.round(progress)}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload from Device
            </>
          )}
        </Button>

        {/* URL Input Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setImageUrl(prev => prev ? "" : "show")}
          disabled={uploading || addingUrl}
          className="w-full"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Add Image URL
        </Button>
      </div>

      {/* URL Input Field */}
      {imageUrl !== "" && (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl === "show" ? "" : imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
              disabled={addingUrl}
            />
            <Button
              type="button"
              onClick={handleAddUrl}
              disabled={addingUrl || !imageUrl || imageUrl === "show"}
              className="gold-gradient"
            >
              {addingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a direct link to an image (e.g., from Unsplash, Imgur, etc.)
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative overflow-hidden group">
              <div className="relative aspect-square">
                <SafeImage
                  src={image.image_url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_cover && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetCover(image.id)}
                    >
                      Set as Cover
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(image.id, image.image_url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Cover Badge */}
                {image.is_cover && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Cover
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No images uploaded yet</p>
            <p className="text-sm mt-1">Click the button above to add images</p>
          </div>
        </Card>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <span>💡</span>
        <div>
          <p className="font-medium mb-1">Tips for best results:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload multiple images to showcase your property</li>
            <li>Max 5MB per image (compress large files first)</li>
            <li>Maximum 10 images per listing</li>
            <li>First image becomes the cover (or set manually)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

