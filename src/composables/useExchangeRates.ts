import { useFetch, useIntervalFn } from '@vueuse/core'
import type { ExchangeRatesResponse } from '../types/exchange'

// Composable: Fetch and auto-refresh crypto exchange rates from Coinbase
export function useExchangeRates() {
  // Fetch rates from Coinbase API (immediate: true = fetch on load)
  // data: The fetched exchange rates object
  // isFetching: Loading state (true while request is in flight)
  // error: Error object if the request fails
  // execute: Function to manually trigger a refresh
  const { data, isFetching, error, execute } = useFetch<ExchangeRatesResponse>(
    'https://api.coinbase.com/v2/exchange-rates?currency=USD',
    { immediate: true },
  ).json()

  // Auto-refresh rates every 60 seconds (but skip if already fetching)
  useIntervalFn(() => {
    if (!isFetching.value) {
      execute()
    }
  }, 60000)

  return {
    data,
    isFetching,
    error,
    execute,
  }
}
