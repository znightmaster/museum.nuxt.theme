<template>
  <section class="museum-map">

    <div class="header">
      <div class="mono">
        ЛОКАЦИЯ ОБЪЕКТА №001
      </div>

      <div class="stamp">
        ОТКРЫТО
      </div>
    </div>

    <div class="map-frame">

      <div class="rivets tl"></div>
      <div class="rivets tr"></div>
      <div class="rivets bl"></div>
      <div class="rivets br"></div>

      <!-- Основной просмотрщик -->
      <div class="viewer" @click="openLightbox(activeIndex)">
        <img :src="active.src" :alt="active.name" class="viewer-img">
        <div class="viewer-caption">
          <span class="plan-tag">{{ active.tag }}</span>
          <span class="plan-name">{{ active.name }}</span>
        </div>
        <div class="zoom-hint">⤢ увеличить</div>
      </div>

      <!-- Миниатюры-планы -->
      <div class="thumbs">
        <button
            v-for="(p, i) in plans"
            :key="p.tag"
            class="thumb"
            :class="{ 'is-active': i === activeIndex }"
            @click="activeIndex = i"
        >
          <img :src="p.src" :alt="p.name">
          <span>{{ p.tag }}</span>
        </button>
      </div>

    </div>

    <div class="footer">

      <div class="info">

        <div>
          <span>GPS</span>
          52.923417, 78.582111
        </div>

        <div>
          <span>АДРЕС</span>
          г. Яровое
        </div>

      </div>

      <a href="https://yandex.kz/maps/ru/-/CTV2ZGkf">
        Построить маршрут →
      </a>

    </div>

    <!-- Лайтбокс -->
    <teleport to="body">
      <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox" aria-label="Закрыть">×</button>

        <button class="lb-nav lb-prev" @click="prev" aria-label="Предыдущий план">‹</button>
        <img :src="active.src" :alt="active.name" class="lb-img">
        <button class="lb-nav lb-next" @click="next" aria-label="Следующий план">›</button>

        <div class="lb-caption">
          <span class="plan-tag">{{ active.tag }}</span>
          {{ active.name }}
        </div>

        <div class="lb-dots">
          <span
              v-for="(p, i) in plans"
              :key="'dot-'+p.tag"
              class="dot"
              :class="{ 'is-active': i === activeIndex }"
              @click="activeIndex = i"
          ></span>
        </div>
      </div>
    </teleport>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const plans = [
  { src: '/plan-01-panorama.jpg', tag: 'ПЛАН 01', name: 'Панорама города' },
  { src: '/plan-02-quarter.jpg',  tag: 'ПЛАН 02', name: 'Трасса и квартал' },
  { src: '/plan-03-junction.jpg', tag: 'ПЛАН 03', name: 'Перекрёсток' },
  { src: '/plan-04-site.jpg',     tag: 'ПЛАН 04', name: 'Территория музея' },
]

const activeIndex = ref(0)
const active = computed(() => plans[activeIndex.value])
const lightboxOpen = ref(false)

function openLightbox(i) {
  activeIndex.value = i
  lightboxOpen.value = true
}
function closeLightbox() {
  lightboxOpen.value = false
}
function next() {
  activeIndex.value = (activeIndex.value + 1) % plans.length
}
function prev() {
  activeIndex.value = (activeIndex.value - 1 + plans.length) % plans.length
}

function onKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>

.museum-map{
  background:#26241d;
  border:1px solid rgba(255,255,255,.08);
  padding:28px;
  position:relative;
  box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.03),
      0 25px 60px rgba(0,0,0,.45);
}

.museum-map::before{
  content:"";
  position:absolute;
  inset:10px;
  border:1px dashed rgba(255,255,255,.12);
  pointer-events:none;
}

.header{
  display:flex;
  justify-content:space-between;
  margin-bottom:24px;
}

.mono{
  font-family:"JetBrains Mono";
  color:#b8b39b;
  letter-spacing:.2em;
  font-size:12px;
}

.stamp{
  width:74px;
  height:74px;
  border-radius:50%;
  border:2px solid #a13328;
  color:#a13328;
  display:flex;
  justify-content:center;
  align-items:center;
  transform:rotate(-15deg);
  font-family:"JetBrains Mono";
  font-size:10px;
}

.map-frame{
  position:relative;
  background:#1b1b18;
  padding:14px;
  border:2px solid #4a4538;
}

.rivets{
  width:12px;
  height:12px;
  background:#7d7662;
  border-radius:50%;
  position:absolute;
  box-shadow:
      inset 2px 2px 3px rgba(255,255,255,.15),
      inset -2px -2px 3px rgba(0,0,0,.4);
  z-index:2;
}

.tl{top:8px;left:8px;}
.tr{top:8px;right:8px;}
.bl{bottom:8px;left:8px;}
.br{bottom:8px;right:8px;}

/* ---- viewer ---- */
.viewer{
  position:relative;
  cursor:zoom-in;
  overflow:hidden;
  border:1px solid #3a362b;
}

.viewer-img{
  width:100%;
  height:480px;
  object-fit:cover;
  display:block;
  filter:contrast(1.05);
  transition:transform .5s ease;
}

.viewer:hover .viewer-img{
  transform:scale(1.03);
}

.viewer-caption{
  position:absolute;
  left:0; bottom:0;
  padding:14px 18px;
  background:linear-gradient(to top, rgba(0,0,0,.75), transparent);
  display:flex;
  align-items:baseline;
  gap:10px;
  width:100%;
}

.plan-tag{
  color:#a13328;
  font-family:"JetBrains Mono";
  font-size:11px;
  letter-spacing:.15em;
  border:1px solid #a13328;
  padding:2px 8px;
}

.plan-name{
  color:#e8e1ce;
  font-family:"JetBrains Mono";
  font-size:13px;
  letter-spacing:.05em;
}

.zoom-hint{
  position:absolute;
  top:14px; right:18px;
  color:#d6cfbb;
  font-family:"JetBrains Mono";
  font-size:11px;
  letter-spacing:.1em;
  opacity:0;
  transition:opacity .25s;
  background:rgba(0,0,0,.5);
  padding:4px 10px;
  border:1px solid rgba(255,255,255,.15);
}

.viewer:hover .zoom-hint{ opacity:1; }

/* ---- thumbs ---- */
.thumbs{
  margin-top:10px;
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:10px;
}

.thumb{
  position:relative;
  padding:0;
  border:1px solid #3a362b;
  background:#151310;
  cursor:pointer;
  overflow:hidden;
  transition:border-color .2s;
}

.thumb img{
  width:100%;
  height:74px;
  object-fit:cover;
  display:block;
  filter:grayscale(.2) brightness(.85);
  transition:filter .2s;
}

.thumb span{
  position:absolute;
  left:6px; bottom:6px;
  color:#d6cfbb;
  font-family:"JetBrains Mono";
  font-size:10px;
  letter-spacing:.1em;
  background:rgba(0,0,0,.55);
  padding:2px 6px;
}

.thumb:hover{ border-color:#7d7662; }
.thumb:hover img{ filter:grayscale(0) brightness(1); }

.thumb.is-active{ border-color:#a13328; }
.thumb.is-active img{ filter:grayscale(0) brightness(1); }

/* ---- footer ---- */
.footer{
  margin-top:24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
}

.info{
  display:flex;
  gap:50px;
  color:#d6cfbb;
}

.info span{
  display:block;
  color:#8f8b78;
  font-size:11px;
  font-family:"JetBrains Mono";
  margin-bottom:4px;
}

a{
  color:#e8e1ce;
  background:#a13328;
  padding:14px 24px;
  text-decoration:none;
  text-transform:uppercase;
  font-family:"JetBrains Mono";
  transition:.25s;
}

a:hover{ background:#bb4033; }

/* ---- lightbox ---- */
.lightbox{
  position:fixed;
  inset:0;
  background:rgba(10,9,7,.92);
  z-index:999;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  gap:16px;
  padding:40px;
}

.lb-img{
  max-width:min(1100px, 92vw);
  max-height:74vh;
  object-fit:contain;
  border:2px solid #4a4538;
  box-shadow:0 20px 60px rgba(0,0,0,.6);
}

.lb-caption{
  color:#e8e1ce;
  font-family:"JetBrains Mono";
  font-size:13px;
  letter-spacing:.05em;
  display:flex;
  align-items:center;
  gap:10px;
}

.lb-close{
  position:absolute;
  top:24px; right:28px;
  background:none;
  border:1px solid rgba(255,255,255,.25);
  color:#e8e1ce;
  font-size:22px;
  line-height:1;
  width:40px; height:40px;
  cursor:pointer;
}
.lb-close:hover{ border-color:#a13328; color:#a13328; }

.lb-nav{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  background:none;
  border:1px solid rgba(255,255,255,.25);
  color:#e8e1ce;
  font-size:28px;
  width:48px; height:48px;
  cursor:pointer;
}
.lb-nav:hover{ border-color:#a13328; color:#a13328; }
.lb-prev{ left:24px; }
.lb-next{ right:24px; }

.lb-dots{
  display:flex;
  gap:8px;
}

.dot{
  width:8px; height:8px;
  border-radius:50%;
  background:rgba(255,255,255,.25);
  cursor:pointer;
}
.dot.is-active{ background:#a13328; }

@media (max-width: 640px){
  .thumbs{ grid-template-columns:repeat(2, 1fr); }
  .viewer-img{ height:300px; }
  .lb-nav{ width:40px; height:40px; font-size:22px; }
}

</style>
