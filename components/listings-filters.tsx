"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

export function ListingsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0)
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000)
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1)

  function applyFilters() {
    const params = new URLSearchParams()
    
    if (location) params.set("location", location)
    if (minPrice > 0) params.set("minPrice", minPrice.toString())
    if (maxPrice < 10000) params.set("maxPrice", maxPrice.toString())
    if (guests > 1) params.set("guests", guests.toString())

    router.push(`/listings?${params.toString()}`)
  }

  function clearFilters() {
    setLocation("")
    setMinPrice(0)
    setMaxPrice(10000)
    setGuests(1)
    router.push("/listings")
  }

  const hasActiveFilters = location || minPrice > 0 || maxPrice < 10000 || guests > 1

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="City or country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range (per night)</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[minPrice, maxPrice]}
              onValueChange={([min, max]) => {
                setMinPrice(min)
                setMaxPrice(max)
              }}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                min={0}
                max={maxPrice}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                min={minPrice}
                max={10000}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Guests */}
        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full gold-gradient">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

