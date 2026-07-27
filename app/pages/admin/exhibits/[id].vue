<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')

const form = reactive({
  num: '', name: '', year: '', rotate: 0, stamp: '', zal: '', note: '', image: '', sort_order: 0,
  specs: [],
})

const loading = ref(!isNew.value)
const saving = ref(false)
const error = ref('')

if (!isNew.value) {
  // Отдельного GET-эндпоинта на один экспонат нет — список экспонатов
  // небольшой (десятки, не тысячи), поэтому проще и надёжнее переиспользовать
  // список и найти нужную запись в нём.
  const { data: exhibits } = await useFetch('/api/admin/exhibits', { default: () => [] })
  const found = exhibits.value.find((e) => e.id === route.params.id)
  if (found) {
    Object.assign(form, found, { specs: (found.specs || []).map((s) => ({ ...s })) })
  } else {
    error.value = 'Экспонат не найден'
  }
  loading.value = false
}

function addSpec() {
  form.specs.push({ k: '', v: '' })
}
function removeSpec(i) {
  form.specs.splice(i, 1)
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const payload = { ...form, specs: form.specs.filter((s) => s.k || s.v) }
    if (isNew.value) {
      await $fetch('/api/admin/exhibits', { method: 'POST', body: payload })
    } else {
      await $fetch(`/api/admin/exhibits/${route.params.id}`, { method: 'PUT', body: payload })
    }
    await navigateTo('/admin/exhibits')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-[640px]">
    <NuxtLink to="/admin/exhibits" class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors mb-6 inline-block">
      ← К списку экспонатов
    </NuxtLink>

    <h1 class="font-display uppercase text-2xl mb-8">{{ isNew ? 'Новый экспонат' : 'Экспонат' }}</h1>

    <p v-if="loading" class="text-fgdim">Загрузка…</p>

    <form v-else @submit.prevent="save" class="space-y-6">
      <admin-image-uploader v-model="form.image" label="Фото экспоната (необязательно)" />

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Инв. номер</label>
          <input v-model="form.num" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Год выпуска</label>
          <input v-model="form.year" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Название</label>
        <input v-model="form.name" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Зал (используется для фильтра на сайте)</label>
        <input v-model="form.zal" required placeholder="Например: Ретро-автомобили" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Штамп на карточке</label>
          <input v-model="form.stamp" placeholder="НА ХОДУ" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Наклон карточки, °</label>
          <input v-model.number="form.rotate" type="number" step="0.1" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim">Характеристики</label>
          <button type="button" @click="addSpec" class="font-mono text-[11px] uppercase tracking-wider text-fgdim hover:text-fg">+ строка</button>
        </div>
        <div v-for="(spec, i) in form.specs" :key="i" class="flex gap-2 mb-2">
          <input v-model="spec.k" placeholder="Двигатель" class="flex-1 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim" />
          <input v-model="spec.v" placeholder="2.1 л, 52 л.с." class="flex-1 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim" />
          <button type="button" @click="removeSpec(i)" class="px-3 text-fgdim hover:text-rust">✕</button>
        </div>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Заметка (курсивом внизу карточки)</label>
        <textarea v-model="form.note" rows="3" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"></textarea>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Порядок сортировки (меньше — выше на странице)</label>
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
