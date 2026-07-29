<template>
  <!--
    Корневой элемент — без собственного max-width/паддингов секции:
    ширина и внешние отступы задаются контейнером страницы (см. index.vue, visit.vue),
    чтобы карта не создавала «двойной» контейнер и не съезжала по размерам.
  -->
  <div class="map-frame relative border border-khaki/35 bg-surface p-2.5 flex flex-col-reverse md:block">
    <!-- угловые засечки как на техническом чертеже (акцентный цвет не меняется между темами) -->
    <span class="corner absolute w-[22px] h-[22px] -top-px -left-px border-t-2 border-l-2 border-rust z-[3]" />
    <span class="corner absolute w-[22px] h-[22px] -top-px -right-px border-t-2 border-r-2 border-rust z-[3]" />
    <span class="corner absolute w-[22px] h-[22px] -bottom-px -left-px border-b-2 border-l-2 border-rust z-[3]" />
    <span class="corner absolute w-[22px] h-[22px] -bottom-px -right-px border-b-2 border-r-2 border-rust z-[3]" />

    <!-- сама карта, обёрнутая фильтром под дуотон -->
    <div class="map-wrap relative h-[340px] sm:h-[440px] lg:h-[560px] overflow-hidden">
      <div class="map-tone absolute inset-0 z-[2] pointer-events-none mix-blend-multiply" />
      <div class="map-scan absolute inset-0 z-[2] pointer-events-none opacity-50" />
      <div ref="mapHost" class="map-host absolute inset-0" />
      <button
          v-if="!mapActive"
          type="button"
          class="map-guard absolute inset-0 z-[3] flex items-center justify-center bg-bg/10 hover:bg-bg/20 transition-colors cursor-pointer"
          @click="mapActive = true"
      >
  <span
      class="font-mono text-[11px] tracking-[0.14em] uppercase text-fg bg-surface/90 border border-rust px-4 py-2.5"
  >
    Нажмите, чтобы включить карту
  </span>
      </button>
    </div>

    <!-- инфо-карточка поверх карты (на мобильных — под картой, статичным блоком) -->
    <div
      class="info-card relative md:absolute md:top-7 md:left-7 z-[4] w-full md:w-[300px] -mb-px md:mb-0
             px-6 py-7 bg-surface/95 border border-rust shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    >
      <span class="info-card__tag block font-mono text-[11px] tracking-[0.14em] uppercase text-rust mb-3.5">
        Координаты объекта
      </span>
      <h3 class="info-card__title font-display font-semibold uppercase text-[22px] leading-[1.2] text-fg mb-4">
        Музей<br />«Сделано в СССР»
      </h3>

      <p class="info-card__addr font-body text-sm leading-[1.55] text-khaki mb-4.5">

        г. Яровое, Алтайский край, 658837
      </p>

      <dl class="info-card__meta mb-5 pt-4 border-t border-dashed border-khaki/30">
        <div class="row flex justify-between gap-3 font-mono text-xs mb-2">
          <dt class="text-steel">Тел.</dt>
          <dd class="m-0 text-fg text-right">+7 (905) 982-49-99</dd>
        </div>
        <div class="row flex justify-between gap-3 font-mono text-xs mb-2">
          <dt class="text-steel">Mail</dt>
          <dd class="m-0 text-fg text-right">info@backtoussr.ru</dd>
        </div>
        <div class="row flex justify-between gap-3 font-mono text-xs mb-2">
          <dt class="text-steel">Режим</dt>
          <dd class="m-0 text-fg text-right">Без выходных, 10:00–20:00</dd>
        </div>
      </dl>

      <a
        class="info-card__link inline-block font-display text-[13px] tracking-wider uppercase text-fg
               border-b border-rust pb-0.5 no-underline transition-colors hover:text-rust"
        href="https://yandex.ru/maps/?text=Яровое+пр-т+Мира+12"
        target="_blank"
        rel="noopener"
      >
        Проложить маршрут →
      </a>
    </div>
  </div>
</template>

<script setup>
/**
 * Вставьте сюда ваш реальный код Yandex Constructor.
 * Конструктор отдаёт готовый <script src="...constructor/1.0/js/?um=..."> —
 * он сам находит div с id, указанным в параметре, либо рисует iframe
 * сразу в место вставки скрипта. Ниже — универсальный способ:
 * грузим скрипт динамически внутрь mapHost, чтобы им управлял Vue.
 */
const mapHost = ref(null)

// Пока false — поверх карты висит заглушка map-guard, ловящая клики/скролл на себя,
// чтобы прокрутка страницы колесом мыши над картой не приближала/отдаляла саму карту.
const mapActive = ref(false)
const YANDEX_CONSTRUCTOR_SRC =
  'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A5852070bf1496b96c89052c0a2d1a0235ce5b39d4273cb4c897ae18f9041b569&width=100%25&height=100%25&lang=ru_RU&scroll=true'

onMounted(() => {
  const script = document.createElement('script')
  script.src = YANDEX_CONSTRUCTOR_SRC
  script.charset = 'utf-8'
  script.async = true
  mapHost.value?.appendChild(script)
})
</script>

<style scoped>
/*
  Оставлены только правила, которые неудобно/невозможно выразить утилитами Tailwind:
  дуотон-фильтр карты и градиенты-оверлеи. Цвета/шрифты/раскладка вынесены во template.
  --map-img-filter уже определён под тему (light/dark) в app/assets/css/main.css.
*/

/* дуотон / состаренная карта: тон подстраивается под текущую тему через CSS-переменную */
.map-host {
  filter: var(--map-img-filter);
  transition: filter 0.2s ease;
}

/* тонирующий слой поверх фильтра — виньетка по краям; сделана нейтральной к теме,
   чтобы карта всегда читалась как «состаренный» топографический снимок */
.map-tone {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 0%,
    rgb(var(--color-rust) / 0.08) 45%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

/* лёгкие "сканлайны" под военно-топографическую эстетику */
.map-scan {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.06) 0px,
    rgba(0, 0, 0, 0.06) 1px,
    transparent 1px,
    transparent 3px
  );
}
</style>
