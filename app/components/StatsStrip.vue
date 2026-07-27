<script setup>
import { stats } from '~/utils/museum.js'
</script>

<template>
  <div class="bg-surface border-b border-hline">
    <div class="max-w-[1180px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-y-7 py-9">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        :class="['pl-0', i > 0 ? 'md:pl-6 md:border-l md:border-hline' : '']"
      >
        <div class="font-display font-semibold text-rust text-[34px] leading-none">{{ stat.num }}</div>
        <div class="font-mono text-[11.5px] text-fgdim uppercase tracking-wider mt-2">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>
