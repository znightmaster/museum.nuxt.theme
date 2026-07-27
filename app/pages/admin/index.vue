<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const sections = [
  { to: '/admin/exhibits', title: 'Экспонаты', desc: 'Технические паспорта в разделе «Экспонаты»' },
  { to: '/admin/collections', title: 'Разделы экспозиции', desc: 'Карточки коллекций на главной странице' },
  { to: '/admin/byt', title: 'Зал «Быт»', desc: 'Категории и предметы советской повседневности' },
  { to: '/admin/news', title: 'Новости', desc: 'Посты новостного блога' },
]
</script>

<template>
  <div>
    <h1 class="font-display uppercase text-2xl mb-8">Что редактируем?</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <NuxtLink
        v-for="s in sections"
        :key="s.to"
        :to="s.to"
        class="block border border-hline p-6 hover:border-fgdim transition-colors"
      >
        <div class="font-display uppercase text-lg mb-1.5">{{ s.title }}</div>
        <div class="text-fgdim text-sm">{{ s.desc }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
