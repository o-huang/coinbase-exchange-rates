// Types for Coinbase Exchange Rates API
// https://api.coinbase.com/v2/exchange-rates?currency=USD

// Currency rates mapped as strings (e.g., BTC: "0.0000148610469816")
export type ExchangeRates = Record<string, string>

// API response data: currency code and rates
export interface ExchangeData {
  currency: string
  rates: ExchangeRates
}

// Full API response wrapper
export interface ExchangeRatesResponse {
  data: ExchangeData
}
