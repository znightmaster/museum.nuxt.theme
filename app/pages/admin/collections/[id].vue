<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')

const form = reactive({ tag: '', title: '', description: '', image: '', link: '/exhibits', sort_order: 0 })

const loading = ref(!isNew.value)
const saving = ref(false)
const error = ref('')

if (!isNew.value) {
  const { data: collections } = await useFetch('/api/admin/collections', { default: () => [] })
  const found = collections.value.find((c) => c.id === route.params.id)
  if (found) Object.assign(form, found)
  else error.value = 'Раздел не найден'
  loading.value = false
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (isNew.value) {
      await $fetch('/api/admin/collections', { method: 'POST', body: form })
    } else {
      await $fetch(`/api/admin/collections/${route.params.id}`, { method: 'PUT', body: form })
    }
    await navigateTo('/admin/collections')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-[560px]">
    <NuxtLink to="/admin/collections" class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors mb-6 inline-block">
      ← К списку разделов
    </NuxtLink>

    <h1 class="font-display uppercase text-2xl mb-8">{{ isNew ? 'Новый раздел' : 'Раздел' }}</h1>

    <p v-if="loading" class="text-fgdim">Загрузка…</p>

    <form v-else @submit.prevent="save" class="space-y-6">
      <admin-image-uploader v-model="form.image" />

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Метка (например «РАЗДЕЛ 01»)</label>
        <input v-model="form.tag" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Заголовок</label>
        <input v-model="form.title" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Описание</label>
        <textarea v-model="form.description" rows="3" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"></textarea>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Ссылка при клике на карточку</label>
        <input v-model="form.link" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Порядок сортировки</label>
        <input v-model.number="form.sort_order" type="number" class="w-40 bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <p v-if="error" class="text-rust text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="saving"
        class="font-mono text-[13px] uppercase tracking-wider px-6 py-3.5 bg-rust text-paper hover:bg-rustlight transition-colors disabled:opacity-50"
      >
        {{ saving ? 'Сохраняем…' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>
