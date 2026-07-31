<script setup>
import { zalImageVariants } from '~/utils/museum.js'

const { theme } = useTheme()

// Чертёж экспоната: у каждого есть светлая (normal) и тёмная (black)
// версия линий. Карточка-подложка под чертежом инвертирована относительно
// темы сайта (светлая тема сайта -> тёмная подложка, и наоборот), поэтому
// и версия чертежа берётся "от противного" — та, что контрастна подложке.
function exhibitImage(item) {
  const variants = zalImageVariants(item)
  if (!variants) return null
  return theme.value === 'light' ? variants.normal : variants.black
}

// Если выбранная версия не найдена (404) — пробуем вторую, а не пропадаем совсем.
function exhibitImageFallback(event, item) {
  const variants = zalImageVariants(item)
  if (!variants) return
  const other = theme.value === 'light' ? variants.black : variants.normal
  if (event.target.src !== other) {
    event.target.src = other
  }
}

// Экспонаты редактируются через админку и хранятся в Supabase —
// здесь просто запрашиваем текущий список у сервера.
const { data: exhibits } = await useFetch('/api/exhibits', { default: () => [] })

// Уникальный список залов для фильтра, в порядке первого появления в массиве
const zals = computed(() => {
  const seen = []
  for (const item of exhibits.value) {
    if (!seen.includes(item.zal)) seen.push(item.zal)
  }
  return seen
})

const activeZal = ref('Все')

const filtered = computed(() => {
  if (activeZal.value === 'Все') return exhibits.value
  return exhibits.value.filter((item) => item.zal === activeZal.value)
})
</script>

<template>
  <div>
    <!-- фильтр по залам -->
    <div class="flex flex-wrap gap-2.5 mb-10">
      <button
        type="button"
        class="font-mono text-[12px] uppercase tracking-wider px-4 py-2 border transition-colors"
        :class="activeZal === 'Все'
          ? 'bg-rust border-rust text-paper'
          : 'border-hline text-fgdim hover:border-rust hover:text-rust'"
        @click="activeZal = 'Все'"
      >
        Все
      </button>
      <button
        v-for="zal in zals"
        :key="zal"
        type="button"
        class="font-mono text-[12px] uppercase tracking-wider px-4 py-2 border transition-colors"
        :class="activeZal === zal
          ? 'bg-rust border-rust text-paper'
          : 'border-hline text-fgdim hover:border-rust hover:text-rust'"
        @click="activeZal = zal"
      >
        {{ zal }}
      </button>
    </div>

    <!-- сетка карточек -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <article
        v-for="item in filtered"
        :key="item.id"
        class="bg-[#f0ece0] text-[#2a2620] shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        :style="{ transform: `rotate(${item.rotate}deg)` }"
      >
        <!-- чертёж экспоната: подложка инвертирована относительно темы сайта -->
        <div
          v-if="exhibitImage(item)"
          class="relative m-3 mb-0 h-32 flex items-center justify-center overflow-hidden transition-colors"
          :class="theme === 'light' ? 'bg-[#181611]' : 'bg-[#f0ece0]'"
        >
          <span
            class="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l"
            :class="theme === 'light' ? 'border-[#55503f]' : 'border-[#2a2620]/35'"
          />
          <span
            class="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r"
            :class="theme === 'light' ? 'border-[#55503f]' : 'border-[#2a2620]/35'"
          />
          <span
            class="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l"
            :class="theme === 'light' ? 'border-[#55503f]' : 'border-[#2a2620]/35'"
          />
          <span
            class="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r"
            :class="theme === 'light' ? 'border-[#55503f]' : 'border-[#2a2620]/35'"
          />
          <img
            :src="exhibitImage(item)"
            :alt="item.name"
            class="h-20 w-auto object-contain opacity-90"
            @error="exhibitImageFallback($event, item)"
          />
        </div>

        <div class="p-6 relative">
          <!-- штамп -->
          <div
            class="absolute top-5 left-6 w-14 h-14 rounded-full border-2 border-[#A13328] text-[#A13328] flex items-center justify-center text-center -rotate-12"
          >
            <span class="font-mono text-[7px] uppercase leading-[1.15] tracking-wide">
              ТЕХПАСПОРТ<br />{{ item.stamp }}
            </span>
          </div>

          <div class="flex justify-between items-start mb-8">
            <span class="pl-16" />
            <span class="font-mono text-xs text-[#2a2620]/50">№ {{ item.num }}</span>
          </div>

          <h3 class="font-display text-xl mt-1">{{ item.name }}</h3>
          <p class="text-sm text-[#2a2620]/70 mb-4">{{ item.year }} год выпуска</p>

          <dl class="space-y-1.5 mb-4">
            <div
              v-for="spec in item.specs"
              :key="spec.k"
              class="flex justify-between text-sm"
            >
              <dt class="text-[#2a2620]/55">{{ spec.k }}</dt>
              <dd>{{ spec.v }}</dd>
            </div>
          </dl>

          <p class="text-[13px] text-[#2a2620]/65 italic border-t border-dashed border-[#2a2620]/25 pt-3">
            {{ item.note }}
          </p>
        </div>
      </article>
    </div>

    <p v-if="filtered.length === 0" class="text-fgdim text-center py-16">
      В этом зале пока нет карточек.
    </p>
  </div>
</template>
