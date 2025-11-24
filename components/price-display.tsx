"use client"

import { useEffect, useState } from "react"
import { formatCurrencyWithCode, type CurrencyCode } from "@/lib/currency"

interface PriceDisplayProps {
  amount: number
  className?: string
  showPerNight?: boolean
}

export function PriceDisplay({ amount, className, showPerNight = false }: PriceDisplayProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    updatePrice()

    // Listen for currency changes
    const handleCurrencyChange = () => {
      updatePrice()
    }

    window.addEventListener('currencyChange', handleCurrencyChange)
    return () => window.removeEventListener('currencyChange', handleCurrencyChange)
  }, [amount])

  const updatePrice = () => {
    const currency = (localStorage.getItem('preferred_currency') || 'USD') as CurrencyCode
    const formatted = formatCurrencyWithCode(amount, currency)
    setFormattedPrice(formatted)
  }

  // Show placeholder during SSR
  if (!isClient) {
    return <span className={className}>$0.00</span>
  }

  return (
    <span className={className}>
      {formattedPrice}
      {showPerNight && " / night"}
    </span>
  )
}

