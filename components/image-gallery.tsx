"use client"

import { useState } from "react"
import { SafeImage } from "@/components/safe-image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: Array<{
    id: string
    image_url: string
    is_cover: boolean
  }>
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-2 rounded-2xl overflow-hidden">
        <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    )
  }

  const coverImage = images.find((img) => img.is_cover) || images[0]
  const otherImages = images.filter((img) => img.id !== coverImage.id).slice(0, 4)

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-2 ${otherImages.length > 0 ? "grid-cols-4" : "grid-cols-1"} rounded-2xl overflow-hidden`}>
        {/* Main Image */}
        <div 
          className={`relative ${otherImages.length > 0 ? "col-span-4 md:col-span-2" : "col-span-1"} h-96 md:row-span-2 bg-muted overflow-hidden cursor-pointer group`}
          onClick={() => setSelectedIndex(0)}
        >
          <SafeImage
            src={coverImage.image_url}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnail Images */}
        {otherImages.map((image, index) => (
          <div
            key={image.id}
            className="relative h-48 md:col-span-1 col-span-2 bg-muted overflow-hidden cursor-pointer group"
            onClick={() => setSelectedIndex(index + 1)}
          >
            <SafeImage
              src={image.image_url}
              alt={`${title} - Image ${index + 2}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}

        {/* "Show all photos" overlay on last image */}
        {images.length > 5 && (
          <div
            className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-background"
            onClick={() => setSelectedIndex(0)}
          >
            <p className="text-sm font-medium">+{images.length - 5} more photos</p>
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
              <p className="text-sm font-medium">
                {selectedIndex !== null ? selectedIndex + 1 : 0} / {images.length}
              </p>
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image */}
            {selectedIndex !== null && (
              <div className="relative w-full h-full">
                <SafeImage
                  src={images[selectedIndex].image_url}
                  alt={`${title} - Image ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg max-w-full overflow-x-auto">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedIndex === index ? "border-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <SafeImage
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

