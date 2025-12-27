<script setup lang="ts">
import { ref } from 'vue';
import { Pipette, RotateCcw } from 'lucide-vue-next';
import ImageUploader from './components/ImageUploader.vue';
import ColorEyedropper from './components/ColorEyedropper.vue';
import PantoneCard from './components/PantoneCard.vue';
import { findClosestPantone } from './utils/color-matching';
import type { PantoneColor } from './data/pantone-colors';

const currentImage = ref<string | null>(null);
const pickedColor = ref<string | null>(null);
const matchedPantone = ref<PantoneColor | null>(null);

function handleImageSelect(imageData: string) {
  currentImage.value = imageData;
  pickedColor.value = null;
  matchedPantone.value = null;
}

function handlePick(hex: string) {
  pickedColor.value = hex;
  matchedPantone.value = findClosestPantone(hex);
}

function reset() {
  currentImage.value = null;
  pickedColor.value = null;
  matchedPantone.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
            <span class="font-bold text-lg">P</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-gray-900">Pantone Picker</h1>
        </div>
        
        <button 
          v-if="currentImage"
          @click="reset"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw :size="16" />
          New Image
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      
      <div v-if="!currentImage" class="max-w-xl mx-auto mt-12 flex flex-col gap-8">
        <div class="text-center">
          <h2 class="text-3xl font-extra-bold text-gray-900 mb-4">Find your Pantone color</h2>
          <p class="text-lg text-gray-600">Upload an image, pick a pixel, and get the closest Pantone match instantly.</p>
        </div>
        <ImageUploader @select="handleImageSelect" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left: Canvas / Eyedropper -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-center min-h-[400px] overflow-hidden bg-checkered">
          <ColorEyedropper 
            :imageSrc="currentImage" 
            @pick="handlePick"
          />
        </div>

        <!-- Right: Results -->
        <div class="space-y-6 sticky top-24">
          
          <div v-if="pickedColor && matchedPantone" class="flex flex-col items-center animate-fade-in">
             <PantoneCard :color="matchedPantone" :pickedHex="pickedColor" />
             
             <!-- Comparison Details -->
             <div class="mt-8 w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
               <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Color Match</h3>
               
               <div class="flex items-center justify-between mb-2">
                 <span class="text-sm text-gray-600">Picked Hex</span>
                 <span class="font-mono font-medium text-gray-900">{{ pickedColor }}</span>
               </div>
               <div class="flex items-center gap-2 mb-4">
                 <div class="w-full h-8 rounded-md border border-gray-200" :style="{ backgroundColor: pickedColor }"></div>
               </div>

                <div class="flex items-center justify-between mb-2">
                 <span class="text-sm text-gray-600">Pantone Hex</span>
                 <span class="font-mono font-medium text-gray-900">{{ matchedPantone.hex }}</span>
               </div>
               <div class="flex items-center gap-2">
                 <div class="w-full h-8 rounded-md border border-gray-200" :style="{ backgroundColor: matchedPantone.hex }"></div>
               </div>
             </div>
          </div>

          <div v-else class="h-80 flex flex-col items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 p-8 text-center">
            <Pipette :size="48" class="mb-4 opacity-50" />
            <p class="font-medium">Click anywhere on the image to sample a color</p>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<style>
.bg-checkered {
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
