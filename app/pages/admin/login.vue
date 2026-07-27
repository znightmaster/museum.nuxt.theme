<script setup>
// у страницы логина нет layout: 'admin' — ей не нужна шапка с навигацией
// по разделам админки, до входа она всё равно бесполезна
definePageMeta({ layout: false })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    await navigateTo('/admin')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось войти'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg text-fg font-body flex items-center justify-center px-6">
    <form @submit.prevent="submit" class="w-full max-w-[360px]">
      <h1 class="font-display uppercase text-2xl mb-1">Админка музея</h1>
      <p class="text-fgdim text-sm mb-8">Введите пароль, чтобы редактировать сайт.</p>

      <input
        v-model="password"
        type="password"
        autofocus
        placeholder="Пароль"
        class="w-full bg-surface border border-hline px-4 py-3 text-fg mb-3 focus:outline-none focus:border-fgdim"
      />

      <p v-if="error" class="text-rust text-sm mb-3">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full font-mono text-[13px] uppercase tracking-wider px-6 py-3.5 bg-rust text-paper hover:bg-rustlight transition-colors disabled:opacity-50"
      >
        {{ loading ? 'Входим…' : 'Войти' }}
      </button>
    </form>
  </div>
</template>
