"use client"

import Image from "next/image"
import { useState } from "react"
import { Sparkles } from "lucide-react"

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  sizes?: string
}

export function SafeImage({ src, alt, fill, className, priority, width, height, sizes }: SafeImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if URL is valid
  const isValidUrl = src && 
    src.startsWith('http') && 
    !src.includes('google.com') && 
    !src.includes('imgres')

  if (!isValidUrl || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Sparkles className="h-12 w-12 text-primary/40" />
      </div>
    )
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={priority}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </>
  )
}

