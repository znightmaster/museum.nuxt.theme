<script setup>
import { newsCategories } from '~/utils/news.js'

// useRoute() даёт доступ к текущему маршруту: адресу, параметрам и т.д.
// route.params.slug — это то самое [slug] из имени файла pages/news/[slug].vue.
const route = useRoute()

// watch: true — при переходе с одного поста на другой (например, по ссылке
// "Другие новости" внизу страницы) Vue Router переиспользует этот же
// компонент, просто меняя route.params.slug, поэтому useFetch должен сам
// перезапросить данные при изменении url.
const { data: post } = await useFetch(() => `/api/news/${route.params.slug}`, {
  watch: [() => route.params.slug],
})

const { data: allNews } = await useFetch('/api/news', { default: () => [] })

const formattedDate = computed(() => {
  if (!post.value) return ''
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(post.value.date)
  )
})

// до трёх других постов, кроме текущего — показать внизу страницы
const otherPosts = computed(() => allNews.value.filter((p) => p.slug !== route.params.slug).slice(0, 3))
</script>

<template>
  <!-- пост найден по slug -->
  <template v-if="post">
    <div class="max-w-[1180px] mx-auto px-8 pt-12">
      <NuxtLink
        to="/news"
        class="font-mono text-[12.5px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors inline-flex items-center gap-2"
      >
        ← Все новости
      </NuxtLink>
    </div>

    <article class="max-w-[820px] mx-auto px-8 pt-8 pb-6">
      <div class="flex items-center gap-3 mb-5 font-mono text-[11px] uppercase tracking-wider">
        <span class="text-rust">{{ newsCategories[post.category] }}</span>
        <span class="text-steel">·</span>
        <span class="text-fgdim">{{ formattedDate }}</span>
      </div>
      <h1 class="font-display uppercase text-[30px] md:text-[42px] leading-tight mb-8">{{ post.title }}</h1>
    </article>

    <div class="max-w-[980px] mx-auto px-8 mb-12">
      <div class="aspect-[16/9] border border-hline overflow-hidden">
        <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover"
        />
        <NewsCoverArt v-else :variant="post.cover" class="w-full h-full" />
      </div>
    </div>

    <article class="max-w-[820px] mx-auto px-8 pb-20">
      <p
        v-for="(paragraph, i) in post.content"
        :key="i"
        class="text-[16px] leading-relaxed text-fgdim mb-5"
      >
        {{ paragraph }}
      </p>
    </article>
    <div v-if="post.gallery && post.gallery.length" class="max-w-[980px] mx-auto px-8 pb-20">
      <div class="font-mono text-xs text-rust uppercase tracking-[0.12em] mb-6">Фотографии</div>
      <NewsGallery :images="post.gallery" />
    </div>

    <section v-if="otherPosts.length" class="border-t border-hline py-20">
      <div class="max-w-[1180px] mx-auto px-8">
        <div class="font-mono text-xs text-rust uppercase tracking-[0.12em] mb-8">Другие новости</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <NewsCard v-for="p in otherPosts" :key="p.slug" :post="p" />
        </div>
      </div>
    </section>
  </template>

  <!-- по такому slug ничего не нашлось -->
  <div v-else class="max-w-[1180px] mx-auto px-8 py-32 text-center">
    <div class="font-mono text-rust text-sm uppercase tracking-[0.14em] mb-4">Публикация не найдена</div>
    <h1 class="font-display uppercase text-[32px] mb-8">Такой новости нет</h1>
    <NuxtLink
      to="/news"
      class="font-mono text-[13px] uppercase tracking-wider px-6 py-4 rounded-sm bg-rust text-paper hover:bg-rustlight transition-colors inline-block"
    >
      Ко всем новостям
    </NuxtLink>
  </div>
</template>
