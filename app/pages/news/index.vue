<script setup>
import { newsCategories } from '~/utils/news.js'

// Новости редактируются через админку и хранятся в Supabase —
// здесь просто запрашиваем текущий (опубликованный) список у сервера.
const { data: allNews } = await useFetch('/api/news', { default: () => [] })

// ref создаёт "реактивную" переменную: когда меняется activeCategory.value,
// Vue сам обновляет всё, что от неё зависит (здесь — computed ниже и подсветку кнопок).
// 'all' — специальное значение фильтра "показать всё".
const activeCategory = ref('all')

// Кнопки фильтра строим из newsCategories, а не пишем руками —
// если появится новая категория, кнопка появится сама.
const filters = [{ key: 'all', label: 'Все' }, ...Object.entries(newsCategories).map(([key, label]) => ({ key, label }))]

// computed пересчитывается автоматически при изменении activeCategory —
// не нужно вручную вызывать функцию фильтрации при каждом клике.
const filteredNews = computed(() => {
  if (activeCategory.value === 'all') return allNews.value
  return allNews.value.filter((post) => post.category === activeCategory.value)
})
</script>

<template>
  <PageHeader
    kicker="Новости музея"
    title="Новости и статьи"
    description="Фестивали, реставрация экспонатов и истории техники — то, чем музей живёт между визитами."
  />

  <section class="pb-24">
    <div class="max-w-[1180px] mx-auto px-8">
      <!-- фильтр по категориям -->
      <div class="flex flex-wrap gap-2.5 mb-12 mt-3">
        <button
          v-for="f in filters"
          :key="f.key"
          type="button"
          @click="activeCategory = f.key"
          :class="[
            'font-mono text-[12px] uppercase tracking-wider px-4 py-2.5 border transition-colors',
            activeCategory === f.key
              ? 'bg-rust border-rust text-paper'
              : 'border-hline text-fgdim hover:border-rust hover:text-rust',
          ]"
        >
          {{ f.label }}
        </button>
      </div>

      <div v-if="filteredNews.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <NewsCard v-for="post in filteredNews" :key="post.slug" :post="post" />
      </div>

      <p v-else class="text-fgdim font-mono text-sm">В этой категории пока нет публикаций.</p>
    </div>
  </section>
</template>
