<script setup>
// Разделы экспозиции редактируются через админку и хранятся в Supabase.
const { data: collections } = await useFetch('/api/collections', { default: () => [] })

const { themed, themedImgFallback } = useThemedImage()
</script>

<template>
  <section class="py-24">
    <div class="max-w-[1180px] mx-auto px-8">
      <div class="flex justify-between items-end gap-6 flex-wrap mb-13 pb-2">
        <div>
          <div class="font-mono text-xs text-rust uppercase tracking-[0.12em] mb-2.5">
            Разделы экспозиции
          </div>
          <h2 class="font-display uppercase text-[28px] md:text-[42px]">
            Четыре коллекции<br />
            под одной крышей
          </h2>
        </div>

        <p class="text-fgdim max-w-[42ch] text-[15px]">
          От гусеничной техники Великой Отечественной до мопедов «Рига» на балконе
          типовой пятиэтажки — маршрут выстроен по хронологии и назначению машин.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hline border border-hline">
        <NuxtLink
            v-for="item in collections"
            :key="item.id"
            :to="item.link"
            class="bg-bg hover:bg-surface transition-all duration-300 p-8 flex flex-col group cursor-pointer"
        >
          <div class="font-mono text-[11px] text-steel tracking-wider mb-5">
            {{ item.tag }}
          </div>

          <div class="mb-5 h-13 flex items-center">
            <img
                :src="themed(item.image)"
                :alt="item.title"
                class="h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                @error="themedImgFallback($event, item.image)"
            />
          </div>

          <div class="mt-auto">
            <h3 class="font-display text-lg mb-2.5 group-hover:text-rust transition-colors">
              {{ item.title }}
            </h3>

            <p class="text-sm text-fgdim">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-10 text-center">
        <NuxtLink
            to="/exhibits"
            class="font-mono text-[13px] uppercase tracking-wider text-rust hover:text-rustlight transition-colors"
        >
          Смотреть все экспонаты →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>