<script setup lang="ts">
import type { PantoneColor } from '../data/pantone-colors';

const props = defineProps<{
  color: PantoneColor;
  pickedHex?: string; // The exact hex picked, to show comparison if needed, or just use pantone
}>();
</script>

<template>
  <div class="pantone-card w-64 h-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 hover:scale-[1.02]">
    <!-- Color Block -->
    <div 
      class="h-56 w-full" 
      :style="{ backgroundColor: color.hex }"
    ></div>
    
    <!-- Info Block -->
    <div class="flex-1 p-4 flex flex-col justify-end">
      <h2 class="text-2xl font-bold text-gray-900 leading-tight">PANTONE<sup class="text-xs">®</sup></h2>
      <p class="text-lg font-mono text-gray-700 mt-1">{{ color.code }}</p>
      <p class="text-sm font-semibold text-gray-500 mt-0.5">{{ color.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.pantone-card {
  /* Classic Pantone Chip Aspect Ratio approx */
}
</style>
