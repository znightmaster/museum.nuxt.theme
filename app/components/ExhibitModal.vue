<script setup>
import { zalImageVariants } from '~/utils/museum.js'

const props = defineProps({
  item: { type: Object, default: null },
})
const emit = defineEmits(['close'])

// --- обложка карточки: та же логика, что и в ExhibitsSection, картинка
// остаётся общим обозначением техники и не меняется при открытии окна ---
const coverImage = computed(() => zalImageVariants(props.item)?.normal || null)
function coverImageFallback(event) {
  const variants = zalImageVariants(props.item)
  if (!variants) return
  if (event.target.src !== variants.black) event.target.src = variants.black
}

// --- галерея фото экспоната ---
const activePhoto = ref(0)
const photos = computed(() => props.item?.photos || [])
function nextPhoto() {
  if (!photos.value.length) return
  activePhoto.value = (activePhoto.value + 1) % photos.value.length
}
function prevPhoto() {
  if (!photos.value.length) return
  activePhoto.value = (activePhoto.value - 1 + photos.value.length) % photos.value.length
}

// --- подразделы "Легенда" / "История" с эффектом печати ---
const { displayed, isTyping, type, skip, reset } = useTypewriter()
const activeTab = ref(null)

const tabs = computed(() => {
  const list = []
  if (props.item?.legend) list.push({ key: 'legend', label: 'Легенда', text: props.item.legend })
  if (props.item?.history) list.push({ key: 'history', label: 'История', text: props.item.history })
  return list
})

function selectTab(tab) {
  if (activeTab.value === tab.key) return
  activeTab.value = tab.key
  type(tab.text)
}

// При открытии нового экспоната — сброс состояния и автозапуск первого подраздела
watch(
  () => props.item,
  (item) => {
    activePhoto.value = 0
    reset()
    activeTab.value = null
    if (item && tabs.value.length) {
      // ждём следующего тика, чтобы tabs успел пересчитаться от нового item
      nextTick(() => selectTab(tabs.value[0]))
    }
  }
)

function onOverlayKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="item"
      class="exhibit-modal-overlay"
      tabindex="-1"
      @click.self="emit('close')"
      @keydown="onOverlayKeydown"
    >
      <div class="exhibit-modal" role="dialog" aria-modal="true" :aria-label="item.name">
        <button class="exhibit-modal__close" type="button" aria-label="Закрыть" @click="emit('close')">×</button>

        <div class="exhibit-modal__scroll">
          <!-- шапка: обложка + техпаспорт -->
          <div class="exhibit-modal__header">
            <div v-if="coverImage" class="exhibit-modal__cover">
              <span class="corner corner--tl" /><span class="corner corner--tr" />
              <span class="corner corner--bl" /><span class="corner corner--br" />
              <img :src="coverImage" :alt="item.name" @error="coverImageFallback" />
            </div>

            <div class="exhibit-modal__meta">
              <div class="exhibit-modal__top-row">
                <span class="exhibit-modal__badge">ТЕХПАСПОРТ<br />{{ item.stamp }}</span>
                <span class="exhibit-modal__num">№ {{ item.num }}</span>
              </div>
              <h2 class="exhibit-modal__title">{{ item.name }}</h2>
              <p class="exhibit-modal__year">{{ item.year }} год выпуска</p>

              <dl v-if="item.specs?.length" class="exhibit-modal__specs">
                <div v-for="spec in item.specs" :key="spec.k" class="exhibit-modal__spec-row">
                  <dt>{{ spec.k }}</dt>
                  <dd>{{ spec.v }}</dd>
                </div>
              </dl>

              <p v-if="item.note" class="exhibit-modal__note">{{ item.note }}</p>
            </div>
          </div>

          <!-- фотогалерея -->
          <div v-if="photos.length" class="exhibit-modal__gallery">
            <div class="exhibit-modal__viewer">
              <button
                v-if="photos.length > 1"
                class="exhibit-modal__nav exhibit-modal__nav--prev"
                type="button"
                aria-label="Предыдущее фото"
                @click="prevPhoto"
              >
                ‹
              </button>
              <img :src="photos[activePhoto]" :alt="`${item.name}, фото ${activePhoto + 1}`" class="exhibit-modal__photo" />
              <button
                v-if="photos.length > 1"
                class="exhibit-modal__nav exhibit-modal__nav--next"
                type="button"
                aria-label="Следующее фото"
                @click="nextPhoto"
              >
                ›
              </button>
            </div>
            <div v-if="photos.length > 1" class="exhibit-modal__thumbs">
              <button
                v-for="(photo, i) in photos"
                :key="i"
                type="button"
                class="exhibit-modal__thumb"
                :class="{ 'is-active': i === activePhoto }"
                @click="activePhoto = i"
              >
                <img :src="photo" :alt="`${item.name} ${i + 1}`" />
              </button>
            </div>
          </div>

          <!-- легенда / история -->
          <div v-if="tabs.length" class="exhibit-modal__section">
            <div class="exhibit-modal__tabs">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="exhibit-modal__tab"
                :class="{ 'is-active': activeTab === tab.key }"
                @click="selectTab(tab)"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="exhibit-modal__typed" @click="isTyping ? skip() : null">
              <p class="exhibit-modal__typed-text">
                {{ displayed }}<span v-if="isTyping" class="exhibit-modal__cursor">▌</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.exhibit-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.exhibit-modal {
  position: relative;
  width: 100%;
  max-width: 720px;
  max-height: 88vh;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-fg));
  border: 1px solid var(--color-hline);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}

.exhibit-modal__scroll {
  max-height: 88vh;
  overflow-y: auto;
  padding: 28px;
}

.exhibit-modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-hline);
  background: rgb(var(--color-surface));
  color: rgb(var(--color-fgdim));
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.exhibit-modal__close:hover {
  color: rgb(var(--color-rust));
  border-color: rgb(var(--color-rust));
}

/* --- шапка --- */
.exhibit-modal__header {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}

.exhibit-modal__cover {
  position: relative;
  flex: 0 0 200px;
  width: 200px;
  height: 160px;
  background: #181611;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.exhibit-modal__cover img {
  height: 96px;
  width: auto;
  object-fit: contain;
  opacity: 0.9;
}
.corner {
  position: absolute;
  width: 9px;
  height: 9px;
  border-color: #55503f;
}
.corner--tl { top: 6px; left: 6px; border-top: 1px solid; border-left: 1px solid; }
.corner--tr { top: 6px; right: 6px; border-top: 1px solid; border-right: 1px solid; }
.corner--bl { bottom: 6px; left: 6px; border-bottom: 1px solid; border-left: 1px solid; }
.corner--br { bottom: 6px; right: 6px; border-bottom: 1px solid; border-right: 1px solid; }

.exhibit-modal__meta {
  flex: 1 1 260px;
  min-width: 220px;
}
.exhibit-modal__top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.exhibit-modal__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 2px solid rgb(var(--color-rust));
  color: rgb(var(--color-rust));
  transform: rotate(-12deg);
  font-family: var(--font-mono, monospace);
  font-size: 7px;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}
.exhibit-modal__num {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: rgb(var(--color-fgdim));
}
.exhibit-modal__title {
  font-family: var(--font-display, inherit);
  font-size: 22px;
  margin: 2px 0 2px;
}
.exhibit-modal__year {
  font-size: 13px;
  color: rgb(var(--color-fgdim));
  margin-bottom: 12px;
}
.exhibit-modal__specs {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}
.exhibit-modal__spec-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  border-bottom: 1px dotted var(--color-hline);
  padding-bottom: 3px;
}
.exhibit-modal__spec-row dt {
  color: rgb(var(--color-fgdim));
}
.exhibit-modal__note {
  font-size: 12.5px;
  font-style: italic;
  color: rgb(var(--color-fgdim));
  border-top: 1px dashed var(--color-hline);
  padding-top: 8px;
  margin-top: 8px;
}

/* --- галерея --- */
.exhibit-modal__gallery {
  margin-top: 24px;
  border-top: 1px solid var(--color-hline);
  padding-top: 20px;
}
.exhibit-modal__viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--color-bg));
  border: 1px solid var(--color-hline);
  min-height: 220px;
}
.exhibit-modal__photo {
  max-width: 100%;
  max-height: 360px;
  display: block;
}
.exhibit-modal__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  width: 34px;
  height: 34px;
  font-size: 19px;
  cursor: pointer;
}
.exhibit-modal__nav--prev { left: 8px; }
.exhibit-modal__nav--next { right: 8px; }
.exhibit-modal__thumbs {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
}
.exhibit-modal__thumb {
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  flex: 0 0 auto;
  opacity: 0.7;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}
.exhibit-modal__thumb.is-active {
  border-color: rgb(var(--color-rust));
  opacity: 1;
}
.exhibit-modal__thumb img {
  width: 64px;
  height: 48px;
  object-fit: cover;
  display: block;
}

/* --- легенда / история --- */
.exhibit-modal__section {
  margin-top: 24px;
  border-top: 1px solid var(--color-hline);
  padding-top: 20px;
}
.exhibit-modal__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.exhibit-modal__tab {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 16px;
  border: 1px solid var(--color-hline);
  background: transparent;
  color: rgb(var(--color-fgdim));
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.exhibit-modal__tab:hover {
  color: rgb(var(--color-rust));
  border-color: rgb(var(--color-rust));
}
.exhibit-modal__tab.is-active {
  background: rgb(var(--color-rust));
  border-color: rgb(var(--color-rust));
  color: rgb(var(--color-paper));
}
.exhibit-modal__typed {
  background: rgb(var(--color-surface2));
  border: 1px dashed var(--color-hline);
  padding: 18px;
  min-height: 96px;
  cursor: text;
}
.exhibit-modal__typed-text {
  font-family: var(--font-mono, monospace);
  font-size: 13.5px;
  line-height: 1.7;
  color: rgb(var(--color-fg));
  white-space: pre-wrap;
  margin: 0;
}
.exhibit-modal__cursor {
  display: inline-block;
  color: rgb(var(--color-rust));
  animation: exhibit-caret-blink 0.9s steps(1) infinite;
}
@keyframes exhibit-caret-blink {
  50% { opacity: 0; }
}

@media (max-width: 520px) {
  .exhibit-modal__cover {
    width: 100%;
    flex-basis: 100%;
    height: 140px;
  }
}
</style>
