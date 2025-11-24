"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, MapPin, Search, Users } from "lucide-react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { getLocationSuggestions } from "@/lib/actions/search"
import { Card } from "@/components/ui/card"

export function SearchBar() {
  const [location, setLocation] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(1)
  const [suggestions, setSuggestions] = useState<Array<{ city: string; country: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch suggestions when location changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 1) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoadingSuggestions(true)
      const result = await getLocationSuggestions(location)
      setSuggestions(result.suggestions)
      setShowSuggestions(true)
      setIsLoadingSuggestions(false)
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [location])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (guests > 1) params.set("guests", guests.toString())
    if (dateRange?.from) params.set("checkIn", format(dateRange.from, "yyyy-MM-dd"))
    if (dateRange?.to) params.set("checkOut", format(dateRange.to, "yyyy-MM-dd"))

    setShowSuggestions(false)
    router.push(`/listings?${params.toString()}`)
  }

  function selectSuggestion(city: string, country: string) {
    setLocation(`${city}, ${country}`)
    setShowSuggestions(false)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-5xl mx-auto">
      <div className="glass-effect rounded-2xl p-4 shadow-2xl relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Location with Autocomplete */}
          <div className="space-y-2 relative" ref={searchRef}>
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </label>
            <Input
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => location.length >= 1 && setShowSuggestions(true)}
              className="bg-background/50 border-primary/20"
              autoComplete="off"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && !isLoadingSuggestions && (
              <Card className="absolute z-[100] w-full mt-1 shadow-lg border-primary/20 max-h-60 overflow-auto">
                {suggestions.length > 0 ? (
                  <div className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.city}-${suggestion.country}-${index}`}
                        type="button"
                        onClick={() => selectSuggestion(suggestion.city, suggestion.country)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">{suggestion.city}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No locations found for &quot;{location}&quot;
                  </div>
                )}
              </Card>
            )}

            {isLoadingSuggestions && location.length >= 1 && (
              <Card className="absolute z-[100] w-full mt-1 shadow-lg border-primary/20">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading suggestions...
                </div>
              </Card>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Dates
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background/50 border-primary/20"
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">When?</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={{ before: new Date() }}
                  numberOfMonths={2}
                  defaultMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Guests
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="bg-background/50 border-primary/20"
            />
          </div>

          {/* Search Button */}
          <Button type="submit" size="lg" className="gold-gradient h-11">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}

