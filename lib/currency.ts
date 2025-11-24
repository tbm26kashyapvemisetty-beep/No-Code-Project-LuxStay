export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
} as const

export type CurrencyCode = keyof typeof currencies

export const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  JPY: 149.50,
  CNY: 7.24,
}

export function convertCurrency(amountInUSD: number, toCurrency: CurrencyCode): number {
  return amountInUSD * exchangeRates[toCurrency]
}

export function formatCurrencyWithCode(amount: number, currencyCode: CurrencyCode): string {
  const currency = currencies[currencyCode]
  const convertedAmount = convertCurrency(amount, currencyCode)
  
  // Format based on currency
  if (currencyCode === 'JPY' || currencyCode === 'CNY') {
    // No decimals for yen
    return `${currency.symbol}${Math.round(convertedAmount).toLocaleString()}`
  }
  
  return `${currency.symbol}${convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

