<template>
  <div class="blueprint-map">
    <!-- Переключатель этажей: тот же стиль, что и фильтр залов на /exhibits -->
    <div class="flex flex-wrap gap-2.5 mb-6 mt-3">
      <button
          v-for="floor in floors"
          :key="floor"
          type="button"
          class="font-mono text-[12px] uppercase tracking-wider px-4 py-2 border rounded-sm transition-colors"
          :class="activeFloor === floor
            ? 'bg-rust border-rust text-paper'
            : 'border-hline text-fgdim hover:border-rust hover:text-rust'"
          @click="activeFloor = floor"
      >
        {{ floor }} этаж
      </button>
    </div>

    <!-- Blueprint-план здания: готовое PNG-изображение плана, в лёгкой рамке как остальные карточки сайта -->
    <div class="blueprint-map__frame">
      <div class="blueprint-map__stage">
        <img
            :src="resolvedMapImage"
            class="blueprint-map__img"
            alt="Схематичный план здания музея"
            draggable="false"
        />

        <!-- Метки поверх PNG, позиционируются в % от площади изображения -->
        <div class="blueprint-map__markers">
          <button
              v-for="item in visibleMarkers"
              :key="item.id"
              class="marker"
              :class="`marker--${item.type}`"
              :style="{ left: item.x + '%', top: item.y + '%' }"
              :title="item.type === 'car' ? item.title : undefined"
              type="button"
              @click="item.type === 'exhibit' ? openExhibit(item) : null"
          >
            <span class="marker__dot" />
          </button>
        </div>
      </div>
    </div>

    <div class="blueprint-map__legend">
      <span><i class="marker__dot marker__dot--car" /> площадка с техникой</span>
      <span><i class="marker__dot marker__dot--exhibit" /> стенд быта — открывает галерею</span>
    </div>

    <!-- Модалка-галерея -->
    <Teleport to="body">
      <div v-if="selected" class="gallery-overlay" @click.self="closeExhibit">
        <div class="gallery-modal">
          <div class="gallery-modal__header">
            <div>
              <p class="gallery-modal__title">{{ selected.title }}</p>
              <p v-if="selected.subtitle" class="gallery-modal__subtitle">
                {{ selected.subtitle }}
              </p>
            </div>
            <button class="gallery-modal__close" type="button" @click="closeExhibit">
              ×
            </button>
          </div>

          <div class="gallery-modal__viewer">
            <button
                v-if="selected.photos.length > 1"
                class="gallery-modal__nav gallery-modal__nav--prev"
                type="button"
                @click="prevPhoto"
            >
              ‹
            </button>
            <img
                :src="selected.photos[activePhoto]"
                :alt="selected.title"
                class="gallery-modal__image"
            />
            <button
                v-if="selected.photos.length > 1"
                class="gallery-modal__nav gallery-modal__nav--next"
                type="button"
                @click="nextPhoto"
            >
              ›
            </button>
          </div>

          <div v-if="selected.photos.length > 1" class="gallery-modal__thumbs">
            <button
                v-for="(photo, i) in selected.photos"
                :key="i"
                class="gallery-modal__thumb"
                :class="{ 'is-active': i === activePhoto }"
                type="button"
                @click="activePhoto = i"
            >
              <img :src="photo" :alt="`${selected.title} ${i + 1}`" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- пропсы ---------------------------------------------------------------
// items: единый список меток на всех этажах.
// type: 'car' (площадка с техникой, просто подпись) | 'exhibit' (стенд, открывает галерею)
// x, y: положение в % от площади PNG-плана (0-100), считаются от
// левого верхнего угла картинки — так же, как раньше считались от
// внутренней площади здания в SVG.
// mapImage: путь к готовому PNG-плану. Если проп не передан явно,
// картинка подбирается автоматически под тему (см. themedMapImage ниже).
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  floors: {
    type: Array,
    default: () => [1, 2, 3],
  },
  mapImage: {
    type: String,
    default: '',
  },
})

// --- тема -------------------------------------------------------------------
// museum-map-lightgray.png — для тёмной темы (светло-серый контур),
// museum-map-black.png — для светлой темы (чёрный контур).
const { theme } = useTheme()
const themedMapImage = computed(() =>
    theme.value === 'light' ? '/museum-map-black.png' : '/museum-map-lightgray.png'
)
const resolvedMapImage = computed(() => props.mapImage || themedMapImage.value)

// --- состояние --------------------------------------------------------------
const activeFloor = ref(props.floors[0])
const selected = ref(null)
const activePhoto = ref(0)

const visibleMarkers = computed(() =>
    props.items.filter((item) => item.floor === activeFloor.value)
)

function openExhibit(item) {
  selected.value = item
  activePhoto.value = 0
}
function closeExhibit() {
  selected.value = null
}
function nextPhoto() {
  if (!selected.value) return
  activePhoto.value = (activePhoto.value + 1) % selected.value.photos.length
}
function prevPhoto() {
  if (!selected.value) return
  const len = selected.value.photos.length
  activePhoto.value = (activePhoto.value - 1 + len) % len
}
</script>

<style scoped>
/*
  --bp-* завязаны на реальные переменные темы проекта (main.css),
  поэтому карта автоматически подхватывает khaki/rust и переключается
  вместе со светлой/тёмной темой.
*/
.blueprint-map {
  --bp-line: var(--color-hline);
  --bp-line-strong: rgb(var(--color-fg));
  --bp-accent-car: rgb(var(--color-khaki));
  --bp-accent-exhibit: rgb(var(--color-rust));
  background: transparent;
}

/* Лёгкая рамка вокруг плана — как у остальных карточек сайта (border-hline),
   а не самостоятельный крупный блок. Ширина ограничена, чтобы план не
   доминировал над остальным контентом раздела. */
.blueprint-map__frame {
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid var(--bp-line);
}

.blueprint-map__stage {
  position: relative;
  width: 100%;
}
.blueprint-map__img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

.blueprint-map__markers {
  position: absolute;
  inset: 0;
}
.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.marker--car {
  cursor: default;
}
.marker__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--bp-accent-car);
  background: transparent;
  display: block;
}
.marker--exhibit .marker__dot {
  width: 20px;   /* например, крупнее */
  height: 20px;
  border-color: var(--bp-accent-exhibit);
  background: var(--bp-accent-exhibit);
}
.marker--exhibit:hover .marker__dot {
  outline: 3px solid var(--bp-accent-exhibit);
  outline-offset: 2px;
}

.blueprint-map__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 14px;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgb(var(--color-fgdim));
  align-items: center;
}
.blueprint-map__legend .marker__dot {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  width: 10px;
  height: 10px;
}
.blueprint-map__legend .marker__dot--car {
  border: 2px solid var(--bp-accent-car);
}
.blueprint-map__legend .marker__dot--exhibit {
  border: 2px solid var(--bp-accent-exhibit);
  background: var(--bp-accent-exhibit);
}

/* --- галерея --- */
.gallery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.gallery-modal {
  background: rgb(var(--color-surface));
  color: rgb(var(--color-fg));
  border: 1px solid var(--color-hline);
  max-width: 640px;
  width: 100%;
  padding: 20px;
}
.gallery-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.gallery-modal__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.gallery-modal__subtitle {
  font-size: 13px;
  color: rgb(var(--color-fgdim));
  margin: 4px 0 0;
}
.gallery-modal__close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
}
.gallery-modal__viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--color-bg));
  min-height: 280px;
}
.gallery-modal__image {
  max-width: 100%;
  max-height: 420px;
  display: block;
}
.gallery-modal__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
}
.gallery-modal__nav--prev {
  left: 8px;
}
.gallery-modal__nav--next {
  right: 8px;
}
.gallery-modal__thumbs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
}
.gallery-modal__thumb {
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  flex: 0 0 auto;
}
.gallery-modal__thumb.is-active {
  border-color: rgb(var(--color-rust));
}
.gallery-modal__thumb img {
  width: 64px;
  height: 48px;
  object-fit: cover;
  display: block;
}
</style>