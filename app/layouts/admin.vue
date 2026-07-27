<script setup>
async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-bg text-fg font-body">
    <header class="border-b border-hline">
      <div class="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <NuxtLink to="/admin" class="font-display uppercase tracking-wide text-lg text-fg">
          Админка музея
        </NuxtLink>
        <nav class="flex items-center gap-5 font-mono text-[12px] uppercase tracking-wider text-fgdim">
          <NuxtLink to="/admin/exhibits" class="hover:text-rust transition-colors">Экспонаты</NuxtLink>
          <NuxtLink to="/admin/collections" class="hover:text-rust transition-colors">Разделы</NuxtLink>
          <NuxtLink to="/admin/byt" class="hover:text-rust transition-colors">Быт</NuxtLink>
          <NuxtLink to="/admin/news" class="hover:text-rust transition-colors">Новости</NuxtLink>
          <NuxtLink to="/" class="hover:text-rust transition-colors" target="_blank">Сайт ↗</NuxtLink>
          <button type="button" @click="logout" class="hover:text-rust transition-colors">Выйти</button>
        </nav>
      </div>
    </header>

    <main class="max-w-[1100px] mx-auto px-6 py-10">
      <slot />
    </main>
  </div>
</template>
