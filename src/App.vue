<script setup lang="ts">
import { computed } from 'vue'
import { z } from 'zod'
import { useAssetAllocation } from './composables/useAssetAllocation'
import AllocationCard from './components/AllocationCard.vue'
import btcLogo from './assets/bitcoin-btc-logo.svg'
import ethLogo from './assets/ethereum-eth-logo.svg'

// Get all state and logic from composable (includes rates data)
const { usdInput, btcAmount, ethAmount, isFetching, error, data: ratesData } = useAssetAllocation()

// Get current conversion rates
const btcRate = computed(() => ratesData.value?.data?.rates['BTC'] || '—')
const ethRate = computed(() => ratesData.value?.data?.rates['ETH'] || '—')

// Validate USD input using Zod schema
const amountSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), 'Please enter a valid number')
  .transform((val) => Number(val))
  .refine((num) => num > 0, 'Amount must be greater than 0')

//
const inputError = computed(() => {
  if (!usdInput.value) return null
  const result = amountSchema.safeParse(usdInput.value)
  return !result.success ? result.error.issues[0].message : null
})
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <!-- Skip link for keyboard navigation -->
    <a href="#main-content" class="sr-only">Skip to main content</a>

    <div class="max-w-3xl mx-auto px-4 pt-12 pb-16">
      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Asset Allocation Calculator
        </h1>
        <p class="text-slate-500">Calculate your 70% BTC / 30% ETH allocation</p>
      </header>

      <!-- Main Content -->
      <div id="main-content">
        <!-- Show error if rates failed to load, block UI -->
        <div
          v-if="error"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          class="max-w-md mx-auto text-center py-12"
        >
          <p class="font-semibold text-red-900 mb-4">Unable to load current exchange rates</p>
          <p class="text-sm text-slate-600">Please try again shortly.</p>
        </div>

        <!-- Show UI only when rates are loaded -->
        <template v-else>
          <!-- Exchange Rates Info -->
          <section class="mb-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 class="text-sm font-semibold text-slate-900 mb-3">Current Exchange Rates</h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs text-slate-500">BTC/USD</p>
                <p class="font-mono text-slate-900 wrap-break-words">{{ btcRate }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">ETH/USD</p>
                <p class="font-mono text-slate-900 wrap-break-words">{{ ethRate }}</p>
              </div>
            </div>
          </section>

          <!-- Input Section -->
          <section class="mb-12">
            <div class="space-y-4">
              <!-- USD Input Label -->
              <label for="usd-input" class="block text-sm font-semibold text-slate-900">
                USD Amount <span class="text-red-600">*</span>
              </label>

              <!-- USD Input Field -->
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-400"
                >
                  $
                </span>
                <input
                  id="usd-input"
                  v-model="usdInput"
                  type="text"
                  inputmode="decimal"
                  placeholder="0.00"
                  aria-describedby="input-hint"
                  :aria-invalid="!!inputError"
                  class="w-full pl-10 pr-4 py-4 bg-white border rounded-xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': inputError, 'border-slate-200': !inputError }"
                />
              </div>
              <div v-if="inputError" class="text-sm text-red-600 font-medium">
                {{ inputError }}
              </div>
              <p v-else id="input-hint" class="text-xs text-slate-500">
                Enter the amount you want to invest
              </p>
            </div>
          </section>

          <!-- Results Section -->
          <section v-if="!error" aria-live="polite" aria-atomic="false" class="space-y-6">
            <h2 class="text-lg font-semibold text-slate-900">Your Allocation</h2>

            <!-- Results Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AllocationCard
                :logo="btcLogo"
                title="Bitcoin"
                :allocation="70"
                :amount="!inputError ? btcAmount : '0.00000000'"
                :isFetching="isFetching"
              />
              <AllocationCard
                :logo="ethLogo"
                title="Ethereum"
                :allocation="30"
                :amount="!inputError ? ethAmount : '0.00000000'"
                :isFetching="isFetching"
              />
            </div>
          </section>
        </template>
      </div>
    </div>
  </main>
</template>
