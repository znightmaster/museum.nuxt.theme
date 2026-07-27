<script setup>
import { ref } from 'vue'

defineProps({
  images: { type: Array, required: true },
})

// activeIndex === null значит "лайтбокс закрыт". Как только по миниатюре
// кликнули, сюда попадает её индекс в массиве images, и лайтбокс открывается.
const activeIndex = ref(null)

function open(index) {
  activeIndex.value = index
}
function close() {
  activeIndex.value = null
}
// % images.length зацикливает пролистывание: с последнего фото "вперёд"
// попадаешь на первое, а с первого "назад" — на последнее.
function next(images) {
  activeIndex.value = (activeIndex.value + 1) % images.length
}
function prev(images) {
  activeIndex.value = (activeIndex.value - 1 + images.length) % images.length
}
</script>

<template>
  <div>
    <!-- сетка миниатюр -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="(src, i) in images"
        :key="src"
        type="button"
        class="aspect-square overflow-hidden border border-hline group"
        @click="open(i)"
      >
        <img
          :src="src"
          :alt="`Фото ${i + 1}`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>
    </div>

    <!-- лайтбокс: показывается только когда activeIndex не null -->
    <div
      v-if="activeIndex !== null"
      class="fixed inset-0 z-[100] bg-bg/95 flex items-center justify-center p-6"
      @click.self="close"
    >
      <button
        type="button"
        class="absolute top-6 right-6 font-mono text-fgdim hover:text-fg text-sm uppercase tracking-wider"
        @click="close"
      >
        Закрыть ✕
      </button>

      <button
        type="button"
        class="absolute left-4 md:left-8 text-fgdim hover:text-rust text-3xl px-3 py-2"
        @click="prev(images)"
        aria-label="Предыдущее фото"
      >
        ‹
      </button>

      <img
        :src="images[activeIndex]"
        :alt="`Фото ${activeIndex + 1}`"
        class="max-w-full max-h-[85vh] object-contain border border-hline"
      />

      <button
        type="button"
        class="absolute right-4 md:right-8 text-fgdim hover:text-rust text-3xl px-3 py-2"
        @click="next(images)"
        aria-label="Следующее фото"
      >
        ›
      </button>

      <div class="absolute bottom-6 font-mono text-fgdim text-xs tracking-wider">
        {{ activeIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </div>
</template>
