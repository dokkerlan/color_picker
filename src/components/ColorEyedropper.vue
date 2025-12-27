<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useMouseInElement } from '@vueuse/core';
import { colord } from 'colord';

const props = defineProps<{
  imageSrc: string;
}>();

const emit = defineEmits<{
  (e: 'pick', color: string): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const hoveredColor = ref<string>('transparent');
const isHovering = ref(false);

const { elementX, elementY, isOutside } = useMouseInElement(containerRef);

function initCanvas() {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  ctx.value = context;
  
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = props.imageSrc;
  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    context.drawImage(img, 0, 0);
  };
}

watch(() => props.imageSrc, initCanvas);
onMounted(initCanvas);

// Re-implementing simplified logic with mouse move handler on canvas directly for easier coord mapping
// Re-implementing simplified logic with mouse move handler on canvas directly for easier coord mapping
function handleMouseMove(e: MouseEvent) {
  const context = ctx.value;
  const canvas = canvasRef.value;
  if (!context || !canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  
  // Clamp
  const safeX = Math.max(0, Math.min(x, canvas.width - 1));
  const safeY = Math.max(0, Math.min(y, canvas.height - 1));

  const imageData = context.getImageData(safeX, safeY, 1, 1);
  const pixel = imageData.data;
  
  // Ensure pixel values exist (though they should with 1x1 rect)
  if (pixel.length < 4) return;

  const r = pixel[0] ?? 0;
  const g = pixel[1] ?? 0;
  const b = pixel[2] ?? 0;
  const a = pixel[3] ?? 255;

  const hex = colord({ r, g, b, a: a / 255 }).toHex();
  hoveredColor.value = hex;
}

function handleClick() {
  if (hoveredColor.value) {
    emit('pick', hoveredColor.value);
  }
}

// Magnifier / PreviewTooltip logic
const magnifierStyle = computed(() => {
  if (isOutside.value || !canvasRef.value) return { display: 'none' };
  
  // Position the magnifier near the cursor
  // We want it to float
  return {
    left: `${elementX.value + 20}px`,
    top: `${elementY.value + 20}px`,
    borderColor: hoveredColor.value // Optional border matching color
  };
});

// Let's try a simpler magnifier: 
// A small div that shows the hovered color solidly.
// Real pixel magnifier is nice but complex to get perfect without lag.
// Start with Solid Color Preview + Crosshair.

</script>

<template>
  <div 
    ref="containerRef" 
    class="relative inline-block overflow-hidden rounded-lg shadow-lg cursor-crosshair group"
  >
    <canvas 
      ref="canvasRef" 
      class="block max-w-full h-auto"
      @mousemove="handleMouseMove"
      @click="handleClick"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    ></canvas>

    <!-- Magnifier / PreviewTooltip -->
    <div 
      v-if="!isOutside && isHovering"
      class="fixed pointer-events-none z-50 w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-white"
      :style="magnifierStyle"
    >
      <!-- Color Preview -->
       <div class="w-full h-full" :style="{ backgroundColor: hoveredColor }"></div>
       <!-- Center marker -->
       <div class="absolute w-1 h-1 bg-white mix-blend-difference rounded-full"></div>
    </div>
  </div>
</template>
