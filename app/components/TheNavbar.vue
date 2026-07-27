<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { navLinks } from '~/utils/museum.js'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
let ticking = false

function handleScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 40
    ticking = false
  })
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

// блокируем скролл страницы, пока открыто мобильное меню
watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
      class="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-hline transition-[height] duration-300 ease-out"
      :class="isScrolled ? 'h-12' : 'h-16'"
  >
    <div class="max-w-[1180px] mx-auto px-8 h-full flex items-center justify-between">
      <NuxtLink
          to="/"
          class="flex items-center gap-2.5 font-display font-semibold uppercase tracking-wide text-sm"
          @click="closeMenu"
      >
        <svg
            viewBox="0 0 71 74"
            fill="none"
            class="badge-star shrink-0 transition-all duration-300 ease-out"
            :class="isScrolled ? 'w-12 h-12' : 'w-[60px] h-[60px]'"
            aria-hidden="true"
        >
          <circle
              cx="35.5" cy="37" r="23"
              stroke="#A13328" stroke-width="3"
              class="badge-star__ring-outer"
          />
          <circle
              cx="35.5" cy="37" r="19"
              stroke="#A13328" stroke-width="1.2"
              class="badge-star__ring-inner"
          />
          <polygon
              points="35.5,23 39.61,31.34 48.81,32.67 42.16,39.16 43.73,48.33 35.5,44 27.27,48.33 28.84,39.16 22.19,32.67 31.39,31.34"
              fill="#A13328"
          />
        </svg>

        <span
            class="flex flex-col leading-tight whitespace-nowrap overflow-hidden transition-all duration-300 ease-out"
            :class="isScrolled ? 'max-w-0 opacity-0 -ml-2.5' : 'max-w-[240px] opacity-100 ml-0'"
        >
          <span>Сделано в СССР</span>
          <span class="text-[10px] tracking-wider text-fgdim normal-case">музей ретро техники</span>
        </span>
      </NuxtLink>

      <!-- Десктопная навигация -->
      <div class="hidden md:flex items-center gap-8">
        <nav class="flex gap-7">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="font-mono text-[12.5px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors"
              active-class="text-rust"
              exact-active-class="text-rust"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="pl-8 border-l border-hline flex items-center">
          <ThemeToggle />
        </div>
      </div>

      <!-- Кнопка-бургер для мобильных -->
      <button
          type="button"
          class="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-[5px] shrink-0"
          :aria-expanded="isMenuOpen"
          aria-label="Открыть меню"
          @click="toggleMenu"
      >
        <span
            class="block w-6 h-[1.5px] bg-fg transition-all duration-300 ease-out"
            :class="isMenuOpen ? 'rotate-45 translate-y-[6.5px] bg-rust' : ''"
        />
        <span
            class="block w-6 h-[1.5px] bg-fg transition-all duration-300 ease-out"
            :class="isMenuOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
            class="block w-6 h-[1.5px] bg-fg transition-all duration-300 ease-out"
            :class="isMenuOpen ? '-rotate-45 -translate-y-[6.5px] bg-rust' : ''"
        />
      </button>
    </div>

    <!-- Мобильная выпадающая панель -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
          v-if="isMenuOpen"
          class="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur border-b border-hline flex flex-col px-8 py-5 gap-5"
      >
        <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-mono text-[13px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors"
            active-class="text-rust"
            exact-active-class="text-rust"
            @click="closeMenu"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="flex items-center gap-2.5 pt-1 font-mono text-[13px] uppercase tracking-wider text-fgdim">
          <ThemeToggle />
          Светлая / тёмная тема
        </div>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.badge-star {
  display: block;
}
</style>