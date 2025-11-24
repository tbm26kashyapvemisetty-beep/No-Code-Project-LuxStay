"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateBookingStatus } from "@/lib/actions/bookings"
import { useRouter } from "next/navigation"

interface BookingStatusButtonProps {
  bookingId: string
  action: "confirm" | "cancel"
}

export function BookingStatusButton({ bookingId, action }: BookingStatusButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleClick() {
    setLoading(true)

    const status = action === "confirm" ? "confirmed" : "cancelled"
    const result = await updateBookingStatus(bookingId, status)

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: action === "confirm" ? "Booking Confirmed" : "Booking Cancelled",
        description: `The booking has been ${status}.`,
      })
      router.refresh()
    }

    setLoading(false)
  }

  if (action === "confirm") {
    return (
      <Button onClick={handleClick} disabled={loading} className="gold-gradient">
        <Check className="h-4 w-4 mr-2" />
        {loading ? "Confirming..." : "Confirm"}
      </Button>
    )
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="destructive">
      <X className="h-4 w-4 mr-2" />
      {loading ? "Cancelling..." : "Decline"}
    </Button>
  )
}

