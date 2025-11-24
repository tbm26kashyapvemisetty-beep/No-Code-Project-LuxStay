"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarIcon } from "lucide-react"
import { formatDate, calculateNights } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { createBooking } from "@/lib/actions/bookings"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { PriceDisplay } from "@/components/price-display"

interface BookingWidgetProps {
  listingId: string
  nightlyPrice: number
  bookedDates: Array<{ check_in: string; check_out: string }>
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
}

export function BookingWidget({ 
  listingId, 
  nightlyPrice, 
  bookedDates,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1
}: BookingWidgetProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    // Initialize with search dates if provided
    if (initialCheckIn && initialCheckOut) {
      return {
        from: new Date(initialCheckIn),
        to: new Date(initialCheckOut)
      }
    }
    return undefined
  })
  const [guests, setGuests] = useState(initialGuests)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Convert booked dates to disabled dates
  const disabledDates = bookedDates.flatMap((booking) => {
    const start = new Date(booking.check_in)
    const end = new Date(booking.check_out)
    const dates = []
    
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    
    return dates
  })

  const nights = dateRange?.from && dateRange?.to 
    ? calculateNights(dateRange.from, dateRange.to)
    : 0

  const totalPrice = nights * nightlyPrice

  async function handleBooking() {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select check-in and check-out dates",
      })
      return
    }

    setLoading(true)

    const result = await createBooking({
      listingId,
      checkIn: dateRange.from.toISOString().split("T")[0],
      checkOut: dateRange.to.toISOString().split("T")[0],
      totalPrice,
    })

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: result.error,
      })
      setLoading(false)
      return
    }

    toast({
      title: "Booking Created!",
      description: "Your booking has been submitted successfully.",
    })

    router.push("/dashboard/guest")
    router.refresh()
  }

  return (
    <Card className="border-primary/30">
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="text-3xl font-bold mb-2">
            <PriceDisplay amount={nightlyPrice} showPerNight />
          </div>
          {nights > 0 && (
            <p className="text-sm text-muted-foreground">
              {nights} {nights === 1 ? "night" : "nights"}
            </p>
          )}
        </div>

        <Separator />

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Check-in & Check-out</Label>
            {bookedDates.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>⚠️ Unavailable dates:</p>
                <ul className="space-y-0.5 ml-4">
                  {bookedDates.slice(0, 3).map((booking, idx) => (
                    <li key={idx}>
                      {format(new Date(booking.check_in), "MMM dd")} - {format(new Date(booking.check_out), "MMM dd, yyyy")}
                    </li>
                  ))}
                  {bookedDates.length > 3 && (
                    <li className="text-muted-foreground/60">
                      +{bookedDates.length - 3} more booking{bookedDates.length - 3 > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Select dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={[
                      { before: new Date() },
                      ...disabledDates
                    ]}
                    modifiers={{
                      booked: disabledDates
                    }}
                    modifiersClassNames={{
                      booked: "bg-destructive/15 text-destructive line-through hover:bg-destructive/20 cursor-not-allowed"
                    }}
                    numberOfMonths={2}
                    defaultMonth={dateRange?.from || new Date()}
                  />
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-primary"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-destructive/20 flex items-center justify-center">
                        <span className="text-[8px]">✕</span>
                      </div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  <PriceDisplay amount={nightlyPrice} /> x {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <span><PriceDisplay amount={nightlyPrice * nights} /></span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span><PriceDisplay amount={totalPrice} /></span>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full gold-gradient text-lg h-12"
          onClick={handleBooking}
          disabled={loading || !dateRange?.from || !dateRange?.to}
        >
          {loading ? "Booking..." : "Reserve"}
        </Button>
      </CardFooter>

      {disabledDates.length > 0 && (
        <CardFooter className="px-6 pb-6 pt-0">
          <p className="text-xs text-muted-foreground text-center w-full">
            Some dates are unavailable due to existing bookings
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

