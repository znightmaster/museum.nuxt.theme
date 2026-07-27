<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const categoryId = ref(isNew.value ? null : route.params.id)

const form = reactive({
  idx: '', group_name: '', title: '', count_label: '', years: '', fact: '', size: 'small', icon_svg: '',
})

const items = ref([])
const loading = ref(!isNew.value)
const saving = ref(false)
const error = ref('')

const newItem = reactive({ name: '', year: '' })

if (!isNew.value) {
  const { data: categories } = await useFetch('/api/admin/byt/categories', { default: () => [] })
  const found = categories.value.find((c) => c.id === route.params.id)
  if (found) {
    Object.assign(form, found)
    items.value = (found.items || []).map((i) => ({ ...i }))
  } else {
    error.value = 'Категория не найдена'
  }
  loading.value = false
}

async function saveCategory() {
  saving.value = true
  error.value = ''
  try {
    if (isNew.value) {
      const created = await $fetch('/api/admin/byt/categories', { method: 'POST', body: form })
      // после первого сохранения переходим на страницу редактирования уже
      // существующей категории — только там можно добавлять предметы
      await navigateTo(`/admin/byt/${created.id}`)
    } else {
      await $fetch(`/api/admin/byt/categories/${categoryId.value}`, { method: 'PUT', body: form })
    }
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}

async function saveItem(item) {
  await $fetch(`/api/admin/byt/items/${item.id}`, { method: 'PUT', body: { name: item.name, year: item.year } })
}

async function removeItem(item) {
  if (!confirm(`Удалить предмет «${item.name}»?`)) return
  await $fetch(`/api/admin/byt/items/${item.id}`, { method: 'DELETE' })
  items.value = items.value.filter((i) => i.id !== item.id)
}

async function addItem() {
  if (!newItem.name) return
  const created = await $fetch('/api/admin/byt/items', {
    method: 'POST',
    body: { category_id: categoryId.value, name: newItem.name, year: newItem.year, sort_order: items.value.length },
  })
  items.value.push(created)
  newItem.name = ''
  newItem.year = ''
}
</script>

<template>
  <div class="max-w-[640px]">
    <NuxtLink to="/admin/byt" class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors mb-6 inline-block">
      ← К списку категорий
    </NuxtLink>

    <h1 class="font-display uppercase text-2xl mb-8">{{ isNew ? 'Новая категория' : 'Категория' }}</h1>

    <p v-if="loading" class="text-fgdim">Загрузка…</p>

    <template v-else>
      <form @submit.prevent="saveCategory" class="space-y-6 mb-12">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Номер (01, 02…)</label>
            <input v-model="form.idx" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
          </div>
          <div>
            <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Группа</label>
            <input v-model="form.group_name" required placeholder="БЫТ, АУДИОТЕХНИКА…" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
          </div>
        </div>

        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Название категории</label>
          <input v-model="form.title" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Количество (текстом)</label>
            <input v-model="form.count_label" placeholder="34 экземпляра" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
          </div>
          <div>
            <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Годы</label>
            <input v-model="form.years" placeholder="1955–1982" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
          </div>
        </div>

        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Интересный факт (необязательно)</label>
          <textarea v-model="form.fact" rows="2" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"></textarea>
        </div>

        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Размер плитки в сетке</label>
          <select v-model="form.size" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim">
            <option value="small">small</option>
            <option value="wide">wide</option>
            <option value="tall">tall</option>
            <option value="large">large</option>
          </select>
        </div>

        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">
            SVG-иконка (код &lt;svg&gt;…&lt;/svg&gt;, необязательно — можно оставить пустым)
          </label>
          <textarea v-model="form.icon_svg" rows="3" class="w-full bg-surface border border-hline px-3 py-2 text-fg font-mono text-xs focus:outline-none focus:border-fgdim"></textarea>
        </div>

        <p v-if="error" class="text-rust text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="saving"
          class="font-mono text-[13px] uppercase tracking-wider px-6 py-3.5 bg-rust text-paper hover:bg-rustlight transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Сохраняем…' : 'Сохранить категорию' }}
        </button>
      </form>

      <div v-if="!isNew">
        <h2 class="font-display uppercase text-lg mb-4">Предметы в категории</h2>

        <div v-if="items.length" class="border border-hline divide-y divide-hline mb-4">
          <div v-for="item in items" :key="item.id" class="flex gap-2 items-center p-3">
            <input
              v-model="item.name"
              @change="saveItem(item)"
              class="flex-1 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim"
              placeholder="Название"
            />
            <input
              v-model="item.year"
              @change="saveItem(item)"
              class="w-28 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim"
              placeholder="Год"
            />
            <button type="button" @click="removeItem(item)" class="px-3 text-fgdim hover:text-rust">✕</button>
          </div>
        </div>
        <p v-else class="text-fgdim text-sm mb-4">В этой категории пока нет предметов.</p>

        <div class="flex gap-2">
          <input
            v-model="newItem.name"
            @keyup.enter="addItem"
            placeholder="Название нового предмета"
            class="flex-1 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim"
          />
          <input
            v-model="newItem.year"
            @keyup.enter="addItem"
            placeholder="Год"
            class="w-28 bg-surface border border-hline px-3 py-2 text-sm text-fg focus:outline-none focus:border-fgdim"
          />
          <button
            type="button"
            @click="addItem"
            class="font-mono text-[12px] uppercase tracking-wider px-4 py-2 border border-hline text-fgdim hover:text-fg hover:border-fgdim transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
