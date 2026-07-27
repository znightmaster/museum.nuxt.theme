<script setup>
import SocialLinks from "./SocialLinks.vue";
import { navLinks } from '~/utils/museum.js'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-hline">
    <div class="max-w-[1180px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
      <!-- бренд-блок -->
      <div>
        <NuxtLink
            to="/"
            class="flex items-center gap-2.5 font-display font-semibold uppercase tracking-wide text-sm mb-4"
        >
          <svg viewBox="0 0 71 74" fill="none" class="w-10 h-10 shrink-0" aria-hidden="true">
            <circle cx="35.5" cy="37" r="23" stroke="#A13328" stroke-width="3" />
            <circle cx="35.5" cy="37" r="19" stroke="#A13328" stroke-width="1.2" />
            <polygon points="35.5,23 39.61,31.34 48.81,32.67 42.16,39.16 43.73,48.33 35.5,44 27.27,48.33 28.84,39.16 22.19,32.67 31.39,31.34" fill="#A13328" />
          </svg>
          <span class="flex flex-col leading-tight">
            <span>Сделано в СССР</span>
            <span class="text-[10px] tracking-wider text-fgdim normal-case">музей ретро техники</span>
          </span>
        </NuxtLink>
        <p class="text-[13px] text-fgdim leading-relaxed max-w-[280px]">
          Частная коллекция техники и быта эпохи СССР — от автомобилей до бытовой электроники.
        </p>
      </div>

      <!-- навигация -->
      <div>
        <h3 class="font-mono text-[12px] uppercase tracking-wider text-fgdim mb-4">Разделы</h3>
        <nav class="flex flex-col gap-2.5">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="font-mono text-[12.5px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors w-fit"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- контакты + соцсети -->
      <div>
        <h3 class="font-mono text-[12px] uppercase tracking-wider text-fgdim mb-4">Контакты</h3>
        <div class="flex flex-col gap-2 text-[13px] text-fgdim mb-5">
          <span>г. Яровое, Алтайский край</span>
          <span>Ежедневно, 10:00–20:00</span>
          <a href="tel:+79059824699" class="hover:text-rust transition-colors w-fit">+7 (905) 982-49-99</a>
        </div>
        <SocialLinks />
      </div>
    </div>

    <!-- копирайт -->
    <div class="border-t border-hline">
      <div class="max-w-[1180px] mx-auto px-8 py-5 flex justify-between items-center flex-wrap gap-3 text-[11.5px] text-fgdim/70 font-mono tracking-wide">
        <span>© {{ currentYear }} Музей ретро техники. Все права защищены.</span>
        <a href="#" class="hover:text-rust transition-colors">Политика конфиденциальности</a>
      </div>
    </div>
  </footer>
</template>