<script setup>
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-sm border border-hline text-fgdim hover:text-rust hover:border-rustdim transition-colors"
    :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
    :title="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggleTheme"
  >
    <!-- солнце — показывается в тёмной теме, клик включает светлую -->
    <svg
      v-if="theme === 'dark'"
      viewBox="0 0 24 24"
      class="w-[18px] h-[18px]"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
    <!-- луна — показывается в светлой теме, клик включает тёмную -->
    <svg
      v-else
      viewBox="0 0 24 24"
      class="w-[18px] h-[18px]"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5Z" />
    </svg>
  </button>
</template>
