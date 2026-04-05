import { computed, ref, type Ref } from 'vue'
import { useExchangeRates } from './useExchangeRates'

// Composable: Calculate 70% BTC / 30% ETH allocation based on USD input
export function useAssetAllocation(inputRef?: Ref<string>) {
  // Get live exchange rates from Coinbase API
  const { data, isFetching, error } = useExchangeRates()

  // Store user's USD input amount
  const usdInput = inputRef ?? ref('')

  // Calculate USD value for 70% BTC allocation
  const btcAllocation = computed(() => {
    if (!usdInput.value) return 0
    return parseFloat(usdInput.value) * 0.7
  })

  // Calculate USD value for 30% ETH allocation
  const ethAllocation = computed(() => {
    if (!usdInput.value) return 0
    return parseFloat(usdInput.value) * 0.3
  })

  // Convert BTC USD allocation to BTC amount using current exchange rate
  const btcAmount = computed(() => {
    if (!btcAllocation.value || !data.value?.data?.rates) return '0.00000000'

    const btcRate = data.value.data.rates['BTC']
    if (!btcRate) return '0.00000000'

    const amount = btcAllocation.value * parseFloat(btcRate)
    return amount.toFixed(8)
  })

  // Convert ETH USD allocation to ETH amount using current exchange rate
  const ethAmount = computed(() => {
    if (!ethAllocation.value || !data.value?.data?.rates) return '0.00000000'

    const ethRate = data.value.data.rates['ETH']
    if (!ethRate) return '0.00000000'

    const amount = ethAllocation.value * parseFloat(ethRate)
    return amount.toFixed(8)
  })

  return {
    usdInput,
    btcAmount,
    ethAmount,
    isFetching,
    error,
    data,
  }
}
