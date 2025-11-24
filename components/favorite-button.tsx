"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { toggleFavorite } from "@/lib/actions/favorites"

interface FavoriteButtonProps {
  listingId: string
  initialFavorited: boolean
}

export function FavoriteButton({ listingId, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    
    const result = await toggleFavorite(listingId)
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      setIsFavorited(!isFavorited)
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
      })
    }
    
    setLoading(false)
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
      onClick={handleToggle}
      disabled={loading}
    >
      <Heart
        className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
      />
    </Button>
  )
}

