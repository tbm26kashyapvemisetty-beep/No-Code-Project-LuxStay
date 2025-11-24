"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { currencies, type CurrencyCode } from "@/lib/currency"

export function NavbarCurrencySelector() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage on mount
    const saved = localStorage.getItem('preferred_currency')
    if (saved && saved in currencies) {
      setCurrency(saved as CurrencyCode)
    }
  }, [])

  const handleCurrencyChange = (value: CurrencyCode) => {
    setCurrency(value)
    localStorage.setItem('preferred_currency', value)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: value }))
    // Reload the page to apply currency changes
    window.location.reload()
  }

  if (!mounted) {
    return <div className="w-20" /> // Placeholder
  }

  return (
    <Select value={currency} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-20 h-9 text-xs border-primary/20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(currencies).map(([code, { symbol, name }]) => (
          <SelectItem key={code} value={code} className="text-xs">
            {symbol} {code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

