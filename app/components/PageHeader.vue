<script setup>
// defineProps описывает, какие данные компонент ожидает получить от родителя.
// required: true — Vue выдаст предупреждение в консоли, если проп забыли передать.
defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="max-w-[1180px] mx-auto px-8 pt-16 pb-13">
    <div class="font-mono text-xs text-rust uppercase tracking-[0.12em] mb-2.5">{{ kicker }}</div>
    <!-- v-html тут не нужен — title может содержать перенос строки через \n,
         поэтому используем white-space: pre-line в классе ниже -->
    <h1 class="font-display uppercase text-[32px] md:text-[48px] whitespace-pre-line mb-4">{{ title }}</h1>
    <p v-if="description" class="text-fgdim max-w-[52ch] text-[15px]">{{ description }}</p>
  </div>
</template>
