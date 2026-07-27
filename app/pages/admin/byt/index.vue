<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: categories, refresh } = await useFetch('/api/admin/byt/categories', { default: () => [] })

async function remove(cat) {
  if (!confirm(`Удалить категорию «${cat.title}» вместе со всеми предметами (${cat.items?.length || 0})? Это необратимо.`)) return
  await $fetch(`/api/admin/byt/categories/${cat.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <h1 class="font-display uppercase text-2xl">Зал «Быт»</h1>
      <NuxtLink
        to="/admin/byt/new"
        class="font-mono text-[12px] uppercase tracking-wider px-4 py-2.5 bg-rust text-paper hover:bg-rustlight transition-colors"
      >
        + Категория
      </NuxtLink>
    </div>

    <div v-if="categories.length" class="border border-hline divide-y divide-hline">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="flex items-center gap-4 p-4 hover:bg-surface transition-colors"
      >
        <div class="flex-1 min-w-0">
          <div class="text-fg truncate">{{ cat.title }}</div>
          <div class="font-mono text-[11px] text-fgdim uppercase tracking-wider">
            {{ cat.idx }} · {{ cat.group_name }} · {{ (cat.items || []).length }} предмет(ов)
          </div>
        </div>
        <NuxtLink
          :to="`/admin/byt/${cat.id}`"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors shrink-0"
        >
          Изменить
        </NuxtLink>
        <button
          type="button"
          @click="remove(cat)"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors shrink-0"
        >
          Удалить
        </button>
      </div>
    </div>
    <p v-else class="text-fgdim">Пока нет ни одной категории.</p>
  </div>
</template>
