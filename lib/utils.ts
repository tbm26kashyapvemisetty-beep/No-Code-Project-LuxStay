import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency?: string): string {
  // Check for saved currency preference (client-side only)
  let currencyToUse = currency
  
  if (!currencyToUse && typeof window !== 'undefined') {
    currencyToUse = localStorage.getItem('preferred_currency') || 'USD'
  } else if (!currencyToUse) {
    currencyToUse = 'USD'
  }
  
  // Use our custom currency conversion if available
  if (typeof window !== 'undefined') {
    try {
      const { formatCurrencyWithCode, currencies } = require('./currency')
      if (currencyToUse in currencies) {
        return formatCurrencyWithCode(amount, currencyToUse)
      }
    } catch (e) {
      // Fallback if import fails
    }
  }
  
  // Default Intl formatter
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyToUse,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export function formatDate(date: Date | string): string {
  try {
    return format(new Date(date), "MMM dd, yyyy")
  } catch {
    return String(date)
  }
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

