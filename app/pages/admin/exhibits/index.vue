<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: exhibits, refresh } = await useFetch('/api/admin/exhibits', { default: () => [] })

async function remove(item) {
  if (!confirm(`Удалить «${item.name}»? Это необратимо.`)) return
  await $fetch(`/api/admin/exhibits/${item.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <h1 class="font-display uppercase text-2xl">Экспонаты</h1>
      <NuxtLink
        to="/admin/exhibits/new"
        class="font-mono text-[12px] uppercase tracking-wider px-4 py-2.5 bg-rust text-paper hover:bg-rustlight transition-colors"
      >
        + Добавить
      </NuxtLink>
    </div>

    <div v-if="exhibits.length" class="border border-hline divide-y divide-hline">
      <div
        v-for="item in exhibits"
        :key="item.id"
        class="flex items-center gap-4 p-4 hover:bg-surface transition-colors"
      >
        <div class="w-14 h-14 shrink-0 bg-surface border border-hline overflow-hidden flex items-center justify-center">
          <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" alt="" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-fg truncate">{{ item.name }}</div>
          <div class="font-mono text-[11px] text-fgdim uppercase tracking-wider">
            № {{ item.num }} · {{ item.year }} · {{ item.zal }}
          </div>
        </div>
        <NuxtLink
          :to="`/admin/exhibits/${item.id}`"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors shrink-0"
        >
          Изменить
        </NuxtLink>
        <button
          type="button"
          @click="remove(item)"
          class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-rust transition-colors shrink-0"
        >
          Удалить
        </button>
      </div>
    </div>
    <p v-else class="text-fgdim">Пока нет ни одного экспоната.</p>
  </div>
</template>
