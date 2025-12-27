<script setup lang="ts">
import { ref } from 'vue';
import { useDropZone } from '@vueuse/core';
import { UploadCloud } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'select', imageData: string): void;
}>();

const dropZoneRef = ref<HTMLElement | null>(null);

function processFile(file: File) {
  if (!file.type.startsWith('image/')) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result && typeof e.target.result === 'string') {
      emit('select', e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file) processFile(file);
    }
  },
});

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file) processFile(file);
  }
}
</script>

<template>
  <div 
    ref="dropZoneRef"
    class="relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200"
    :class="[
      isOverDropZone 
        ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' 
        : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
    ]"
  >
    <input 
      type="file" 
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept="image/*"
      @change="handleInput"
    />
    
    <div class="flex flex-col items-center p-6 text-center pointer-events-none">
      <div 
        class="mb-4 p-4 rounded-full bg-gray-100 transition-colors"
        :class="{ 'bg-indigo-100 text-indigo-600': isOverDropZone }"
      >
        <UploadCloud :size="32" :class="isOverDropZone ? 'text-indigo-600' : 'text-gray-400'" />
      </div>
      <p class="text-lg font-medium text-gray-700">
        <span v-if="isOverDropZone">Drop image here...</span>
        <span v-else>Drag & drop an image, or click to select</span>
      </p>
      <p class="mt-2 text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
    </div>
  </div>
</template>
