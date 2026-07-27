<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: posts, refresh } = await useFetch('/api/admin/news', { default: () => [] })

async function remove(post) {
  if (!confirm(`Удалить пост «${post.title}»? Это необратимо.`)) return
  await $fetch(`/api/admin/news/${post.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <h1 class="font-display uppercase text-2xl">Новости</h1>
      <NuxtLink
        to="/admin/news/new"
        class="font-mono text-[12px] uppercase tracking-wider px-4 py-2.5 bg-rust text-paper hover:bg-rustlight transition-colors"
      >
        + Добавить
      </NuxtLink>
    </div>

    <div v-if="posts.length" class="border border-hline divide-y divide-hline">
      <div
        v-for="post in posts"
        :key="post.id"
        class="flex items-center gap-4 p-4 hover:bg-surface transition-colors"
      >
        <div class="w-14 h-14 shrink-0 bg-surface border border-hline overflow-hidden flex items-center justify-center">
          <img v-if="post.image" :src="post.image" class="w-full h-full object-cover" alt="" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-fg truncate flex items-center gap-2">
            {{ post.title }}
            <span v-if="!post.published" class="font-mono text-[10px] uppercase tracking-wider text-fgdim border border-hline px-1.5 py-0.5">
              черновик
            </span>
          </div>
          <div class="font-mono text-[11px] text-fgdim uppercase tracking-wider">{{ post.date }} · /news/{{ post.slug }}</div>
        </div>
        <NuxtLink
          :to="`/admin/news/${post.id}`"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors shrink-0"
        >
          Изменить
        </NuxtLink>
        <button
          type="button"
          @click="remove(post)"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors shrink-0"
        >
          Удалить
        </button>
      </div>
    </div>
    <p v-else class="text-fgdim">Пока нет ни одного поста.</p>
  </div>
</template>
