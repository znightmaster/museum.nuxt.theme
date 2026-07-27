<script setup>
// Все ссылки — в одном месте. Чтобы поменять адрес или добавить новую соцсеть,
// правишь только этот массив, разметка ниже не трогается.
const socials = [
  {
    name: 'Telegram',
    href: 'https://t.me/museumretroysrovoe',
    brandClass: 'social-telegram',
    icon: `<path d="M21.05 3.35 2.9 10.4c-1.24.5-1.23 1.19-.23 1.5l4.65 1.45 1.8 5.53c.22.6.11.84.75.84.49 0 .7-.22.97-.48l2.32-2.25 4.83 3.57c.89.49 1.53.24 1.75-.82l3.17-14.9c.32-1.3-.5-1.88-1.86-1.29z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.9 13.3 18 7.4c.45-.28.86.13.52.44l-7.4 6.68-.28 3.02" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/museum__retro_yarovoe?igsh=MTl1a3Q0dGF4cTA3eA==',
    brandClass: 'social-instagram',
    icon: `<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>`,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/',
    brandClass: 'social-whatsapp',
    icon: `<path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.65-1.22A9 9 0 1 0 12 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.3 8.6c.2-.5.4-.5.6-.5h.4c.15 0 .35 0 .5.4.2.5.65 1.65.7 1.75.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.3-.15.55.15.3.7 1.15 1.5 1.85.95.85 1.65 1.05 1.95 1.2.3.15.45.1.6-.05.15-.15.65-.7.85-1 .2-.25.35-.2.6-.1.25.1 1.6.75 1.85.9.25.15.45.2.5.3.05.15.05.7-.2 1.35-.25.65-1.4 1.25-1.9 1.3-.5.05-1 .25-3.3-.7-2.8-1.15-4.55-4-4.7-4.2-.15-.2-1.1-1.45-1.1-2.8 0-1.35.7-2 1-2.3Z" fill="currentColor" stroke="none"/>`,
  },
  {
    name: 'MAX',
    href: 'https://max.ru/join/yQxsWs8j9cGUkXLNvbgEmwxrtI0sAMnx8T-6oMziRD0',
    brandClass: 'social-max',
    icon: ` <path d="M11.68,0.32C4.73,0.68,0.14,6.14,0.43,13.01c0.13,3.01,1.34,5.6,1.62,8.46,0.07,0.74-0.14,1.65,0.71,1.98,1.05,0.4,2.66-0.27,3.54-0.88,0.3-0.2,0.59-0.44,0.81-0.73,0.91,0.6,1.77,1.19,2.86,1.45,4.77,1.14,10-1.47,12.32-5.68C26.65,9.71,20.75-0.15,11.68,0.32h0Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.98,16.8c-0.38,0.29-0.74,0.69-1.16,0.92-0.6,0.32-0.79-0.01-1.02-0.55-0.71-1.7-0.8-4.59-0.38-6.36,0.56-2.42,2.43-4.54,5-4.77,2.6-0.23,5.01,1.09,6.1,3.47,2.41,5.3-3.76,10.54-8.55,7.29h0Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
  },
]
</script>

<template>
  <div class="flex items-center gap-3">
    <a
      v-for="s in socials"
      :key="s.name"
      :href="s.href || undefined"
      :target="s.href ? '_blank' : undefined"
      rel="noopener noreferrer"
      :class="[
        'social-btn',
        s.brandClass,
        s.href ? '' : 'social-btn--disabled',
      ]"
      :aria-label="s.href ? s.name : `${s.name} — скоро будет доступно`"
      :title="s.href ? s.name : `${s.name} — скоро`"
      @click="!s.href && $event.preventDefault()"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" v-html="s.icon"></svg>
    </a>
  </div>
</template>

<style scoped>
.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1px solid rgba(232, 225, 206, 0.14); /* совпадает с цветом hline из tailwind.config.js */
  background: #2f2c23; /* surface2 */
  color: #c9c2ab; /* paperdim */
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.social-btn:hover {
  transform: scale(1.12) translateY(-1px);
  color: #f5f1e6;
  border-color: transparent;
}

/* фирменные цвета — только при наведении, в состоянии покоя иконки нейтральные,
   под общую сдержанную палитру сайта */
.social-telegram:hover { background: #229ed9; }
.social-instagram:hover {
  background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #515bd4 100%);
}
.social-whatsapp:hover { background: #25d366; }
.social-max:hover {
  background: linear-gradient(135deg, #4a7dff 0%, #7b5cff 100%);
}

.social-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.social-btn--disabled:hover {
  transform: none;
  background: #2f2c23;
  color: #c9c2ab;
  border-color: rgba(232, 225, 206, 0.14);
}
</style>
