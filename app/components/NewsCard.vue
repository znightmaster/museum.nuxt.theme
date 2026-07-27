<script setup>
import { computed } from 'vue'
import NewsCoverArt from './NewsCoverArt.vue'
import { newsCategories } from '~/utils/news.js'

const props = defineProps({
  post: { type: Object, required: true },
})

// computed — значение, которое Vue пересчитывает само, когда меняются
// данные, от которых оно зависит (здесь — props.post.date). Не пишем
// вручную дату на каждой карточке, а форматируем её один раз здесь.
const formattedDate = computed(() =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(props.post.date)
  )
)
</script>

<template>
  <!--
    Ссылка по обычному пути. В Nuxt роуты и их имена генерируются
    автоматически из структуры pages/ — свои имена (как было в старом
    router/index.js) там не заданы, поэтому раньше здесь была ссылка
    на несуществующий именованный роут 'news-post', что и ломало переход.
  -->
  <NuxtLink
    :to="`/news/${post.slug}`"
    class="group block border border-hline bg-surface hover:border-fgdim transition-colors"
  >
    <div class="aspect-[5/3] overflow-hidden border-b border-hline">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <NewsCoverArt
        v-else
        :variant="post.cover"
        class="w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div class="p-6">
      <div class="flex items-center gap-3 mb-3.5 font-mono text-[11px] uppercase tracking-wider">
        <span class="text-rust">{{ newsCategories[post.category] }}</span>
        <span class="text-steel">·</span>
        <span class="text-fgdim">{{ formattedDate }}</span>
      </div>
      <h3 class="font-display text-lg uppercase mb-2.5 leading-snug">{{ post.title }}</h3>
      <p class="text-sm text-fgdim mb-4">{{ post.excerpt }}</p>
      <span class="font-mono text-[12.5px] uppercase tracking-wider text-rust group-hover:text-rustlight transition-colors">
        Читать →
      </span>
    </div>
  </NuxtLink>
</template>
