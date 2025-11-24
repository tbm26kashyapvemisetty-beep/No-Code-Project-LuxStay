"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { currencies, type CurrencyCode } from "@/lib/currency"
import { DollarSign } from "lucide-react"

export function CurrencySelector() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD')

  useEffect(() => {
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

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-primary" />
        Preferred Currency
      </Label>
      <Select value={currency} onValueChange={handleCurrencyChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(currencies).map(([code, { symbol, name }]) => (
            <SelectItem key={code} value={code}>
              {symbol} {name} ({code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        All prices will be displayed in your selected currency
      </p>
    </div>
  )
}

