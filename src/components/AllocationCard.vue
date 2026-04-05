<script setup lang="ts">
interface Props {
  logo: string
  title: string
  allocation: number
  amount: string
  isFetching: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <!-- Loading Skeleton -->
    <div v-if="isFetching" class="p-6 space-y-4">
      <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
      <div class="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
      <div class="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
    </div>

    <!-- Loaded Content -->
    <div v-else class="p-6">
      <div class="mb-4">
        <div class="flex items-center gap-3 mb-3">
          <img :src="logo" :alt="title" class="h-8 w-8" />
          <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        </div>
        <p class="text-sm font-medium text-slate-500 mb-2">{{ allocation }}% Allocation</p>
        <p class="text-2xl md:text-3xl font-bold text-slate-900 font-mono break-words">
          {{ amount }}
        </p>
      </div>
    </div>
  </div>
</template>
