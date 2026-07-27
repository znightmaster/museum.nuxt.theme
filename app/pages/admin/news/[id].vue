<script setup>
import { newsCategories } from '~/utils/news.js'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')

const form = reactive({
  slug: '', title: '', category: Object.keys(newsCategories)[0], date: new Date().toISOString().slice(0, 10),
  excerpt: '', contentText: '', image: '', cover: 'exhibit-case', gallery: [], published: true, sort_order: 0,
})

const loading = ref(!isNew.value)
const saving = ref(false)
const error = ref('')

if (!isNew.value) {
  try {
    const post = await $fetch(`/api/admin/news/${route.params.id}`)
    Object.assign(form, post, {
      contentText: (post.content || []).join('\n'),
      gallery: [...(post.gallery || [])],
    })
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Пост не найден'
  }
  loading.value = false
}

function slugify(text) {
  const map = {
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',
    о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',
    э:'e',ю:'yu',я:'ya',
  }
  return text
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function fillSlugFromTitle() {
  if (isNew.value && !form.slug) form.slug = slugify(form.title)
}

function addGalleryImage(url) {
  if (url) form.gallery.push(url)
}
function removeGalleryImage(i) {
  form.gallery.splice(i, 1)
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const payload = {
      ...form,
      content: form.contentText.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    delete payload.contentText

    if (isNew.value) {
      await $fetch('/api/admin/news', { method: 'POST', body: payload })
    } else {
      await $fetch(`/api/admin/news/${route.params.id}`, { method: 'PUT', body: payload })
    }
    await navigateTo('/admin/news')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось сохранить'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-[640px]">
    <NuxtLink to="/admin/news" class="font-mono text-[12px] uppercase tracking-wider text-fgdim hover:text-fg transition-colors mb-6 inline-block">
      ← К списку новостей
    </NuxtLink>

    <h1 class="font-display uppercase text-2xl mb-8">{{ isNew ? 'Новый пост' : 'Пост' }}</h1>

    <p v-if="loading" class="text-fgdim">Загрузка…</p>
    <p v-else-if="error && !form.title" class="text-rust">{{ error }}</p>

    <form v-else @submit.prevent="save" class="space-y-6">
      <label class="flex items-center gap-2 text-sm text-fgdim">
        <input v-model="form.published" type="checkbox" class="accent-rust" />
        Опубликован (виден на сайте)
      </label>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Заголовок</label>
        <input
          v-model="form.title"
          required
          @blur="fillSlugFromTitle"
          class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"
        />
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">
          Slug (адрес страницы: /news/…), латиницей, без пробелов
        </label>
        <input v-model="form.slug" required pattern="[a-z0-9-]+" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Категория</label>
          <select v-model="form.category" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim">
            <option v-for="(label, key) in newsCategories" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Дата</label>
          <input v-model="form.date" type="date" required class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim" />
        </div>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Краткое описание (для карточки в списке)</label>
        <textarea v-model="form.excerpt" rows="2" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"></textarea>
      </div>

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">
          Текст поста — каждый абзац с новой строки
        </label>
        <textarea v-model="form.contentText" rows="8" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim"></textarea>
      </div>

      <admin-image-uploader v-model="form.image" label="Обложка поста (если не задана — используется заглушка ниже)" />

      <div>
        <label class="block font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">
          Заглушка обложки (используется, только если обложка выше не задана)
        </label>
        <select v-model="form.cover" class="w-full bg-surface border border-hline px-3 py-2 text-fg focus:outline-none focus:border-fgdim">
          <option value="parade">parade</option>
          <option value="workshop">workshop</option>
          <option value="archive">archive</option>
          <option value="exhibit-case">exhibit-case</option>
        </select>
      </div>

      <div>
        <div class="font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">Галерея (необязательно)</div>

        <div v-if="form.gallery.length" class="flex flex-wrap gap-3 mb-3">
          <div v-for="(url, i) in form.gallery" :key="i" class="relative w-20 h-20 border border-hline overflow-hidden group">
            <img :src="url" class="w-full h-full object-cover" alt="" />
            <button
              type="button"
              @click="removeGalleryImage(i)"
              class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-fg text-xs"
            >
              Убрать
            </button>
          </div>
        </div>

        <admin-image-uploader model-value="" label="Добавить фото в галерею" @update:model-value="addGalleryImage" />
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
