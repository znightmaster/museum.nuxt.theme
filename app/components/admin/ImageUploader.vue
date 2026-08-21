<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Изображение' },
})
const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const error = ref('')
const fileInput = ref(null)

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await $fetch('/api/admin/upload', { method: 'POST', body: formData })
    emit('update:modelValue', res.url)
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Не удалось загрузить файл'
  } finally {
    uploading.value = false
    // сбрасываем input, чтобы можно было повторно выбрать тот же файл
    if (fileInput.value) fileInput.value.value = ''
  }
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div>
    <div v-if="label" class="font-mono text-[11px] uppercase tracking-wider text-fgdim mb-2">{{ label }}</div>

    <div class="flex items-start gap-4">
      <div
        class="w-28 h-28 shrink-0 bg-surface border border-hline flex items-center justify-center overflow-hidden"
      >
        <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" alt="" />
        <span v-else class="font-mono text-[10px] text-fgdim/60 text-center px-2">нет картинки</span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2.5 mb-2.5 flex-wrap">
          <label
            class="font-mono text-[12px] uppercase tracking-wider px-3.5 py-2 border border-hline text-fgdim hover:text-fg hover:border-fgdim transition-colors cursor-pointer"
          >
            {{ uploading ? 'Загрузка…' : 'Загрузить файл' }}
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              class="hidden"
              :disabled="uploading"
              @change="onFileChange"
            />
          </label>
          <button
            v-if="modelValue"
            type="button"
            @click="clear"
            class="font-mono text-[12px] uppercase tracking-wider px-3.5 py-2 text-fgdim hover:text-rust transition-colors"
          >
            Убрать
          </button>
        </div>

        <input
          :value="modelValue"
          @input="emit('update:modelValue', $event.target.value)"
          type="text"
          placeholder="или вставьте ссылку на картинку (/luaz.png, https://…)"
          class="w-full bg-surface border border-hline px-3 py-2 text-sm text-fg placeholder:text-fgdim/50 focus:outline-none focus:border-fgdim"
        />

        <p v-if="error" class="text-rust text-xs mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
