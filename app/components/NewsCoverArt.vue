<script setup>
defineProps({
  variant: { type: String, required: true },
})
</script>

<template>
  <svg viewBox="0 0 400 240" class="w-full h-full">
    <rect width="400" height="240" fill="#2f2c23" />

    <!-- ===== фестиваль / колонна техники ===== -->
    <g v-if="variant === 'parade'" fill="none" stroke="#a13328" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
      <line x1="0" y1="176" x2="400" y2="176" stroke="#6b6650" stroke-width="1" opacity="0.5" />
      <!-- солнце -->
      <circle cx="336" cy="56" r="18" stroke="#8c9089" opacity="0.6" />
      <!-- БТР -->
      <path d="M40 160 L40 148 L52 132 L60 128 L96 128 L108 142 L108 160 Z" />
      <circle cx="52" cy="164" r="8" /><circle cx="70" cy="164" r="8" /><circle cx="88" cy="164" r="8" /><circle cx="100" cy="164" r="8" />
      <!-- легковая -->
      <path d="M140 160 L140 152 Q140 147 145 147 L200 147 Q205 147 205 152 L205 160 Z" />
      <path d="M154 147 C156 130 190 130 192 147" />
      <circle cx="152" cy="166" r="7" /><circle cx="192" cy="166" r="7" />
      <!-- флажки на растяжке -->
      <path d="M0 96 Q100 76 400 96" stroke="#c9c2ab" stroke-width="1" opacity="0.5" />
      <path d="M60 91 L60 100 L68 95 Z" fill="#a13328" stroke="none" />
      <path d="M160 84 L160 93 L168 88 Z" fill="#a13328" stroke="none" />
      <path d="M260 84 L260 93 L268 88 Z" fill="#a13328" stroke="none" />
      <path d="M340 90 L340 99 L348 94 Z" fill="#a13328" stroke="none" />
    </g>

    <!-- ===== мастерская / реставрация ===== -->
    <g v-else-if="variant === 'workshop'" fill="none" stroke="#a13328" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
      <line x1="0" y1="184" x2="400" y2="184" stroke="#6b6650" stroke-width="1" opacity="0.5" />
      <!-- машина на подъёмнике -->
      <path d="M150 150 L150 140 Q150 135 156 135 L244 135 Q250 135 250 140 L250 150 Z" />
      <path d="M164 135 C166 118 234 118 236 135" />
      <circle cx="166" cy="156" r="9" /><circle cx="234" cy="156" r="9" />
      <!-- стойки подъёмника -->
      <line x1="140" y1="184" x2="140" y2="120" stroke-width="3" />
      <line x1="260" y1="184" x2="260" y2="120" stroke-width="3" />
      <line x1="140" y1="150" x2="150" y2="150" stroke-width="3" />
      <line x1="250" y1="150" x2="260" y2="150" stroke-width="3" />
      <!-- гаечный ключ на стене -->
      <path d="M60 60 a8 8 0 1 1 0.1 0 M56 64 L34 86 a5 5 0 1 0 8 8 L64 72" stroke-width="2" />
      <!-- полка с банками -->
      <line x1="300" y1="70" x2="370" y2="70" stroke-width="2" />
      <rect x="308" y="50" width="14" height="20" rx="1" />
      <rect x="330" y="50" width="14" height="20" rx="1" />
      <rect x="352" y="50" width="14" height="20" rx="1" />
    </g>

    <!-- ===== архив / документы ===== -->
    <g v-else-if="variant === 'archive'" fill="none" stroke="#a13328" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
      <!-- стопка папок -->
      <rect x="120" y="140" width="120" height="18" rx="2" />
      <rect x="128" y="122" width="120" height="18" rx="2" />
      <rect x="136" y="104" width="120" height="18" rx="2" />
      <line x1="146" y1="113" x2="200" y2="113" stroke="#c9c2ab" stroke-width="1" opacity="0.6" />
      <!-- фотография с уголком -->
      <rect x="252" y="150" width="60" height="44" stroke="#c9c2ab" stroke-width="1.4" />
      <path d="M252 178 L272 160 L284 170 L312 150" stroke="#8c9089" stroke-width="1.2" />
      <!-- лупа -->
      <circle cx="90" cy="90" r="16" />
      <line x1="101" y1="101" x2="118" y2="118" stroke-width="2.4" />
      <!-- штамп-звезда в углу -->
      <g transform="translate(340,60)" opacity="0.55">
        <circle r="16" />
        <polygon points="0,-8 2.4,-2.4 8,-2.4 3.6,1.2 5.2,7 0,3.6 -5.2,7 -3.6,1.2 -8,-2.4 -2.4,-2.4" fill="#a13328" stroke="none" />
      </g>
    </g>

    <!-- ===== витрина / экспозиция ===== -->
    <g v-else-if="variant === 'exhibit-case'" fill="none" stroke="#a13328" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
      <!-- свет сверху -->
      <path d="M170 20 L130 120 L270 120 Z" fill="#e8e1ce" opacity="0.05" stroke="none" />
      <line x1="170" y1="20" x2="170" y2="40" stroke="#c9c2ab" stroke-width="1" opacity="0.6" />
      <!-- витрина -->
      <rect x="90" y="120" width="220" height="70" />
      <line x1="90" y1="150" x2="310" y2="150" stroke-width="1" opacity="0.5" />
      <!-- экспонаты внутри -->
      <rect x="112" y="132" width="22" height="16" rx="1" />
      <circle cx="160" cy="140" r="9" />
      <path d="M195 148 L195 132 L215 132 L220 148 Z" />
      <circle cx="250" cy="140" r="9" />
      <rect x="272" y="130" width="18" height="18" rx="1" />
      <!-- подставка -->
      <line x1="100" y1="190" x2="300" y2="190" stroke-width="2.4" />
      <line x1="110" y1="190" x2="110" y2="200" stroke-width="2.4" />
      <line x1="290" y1="190" x2="290" y2="200" stroke-width="2.4" />
    </g>
  </svg>
</template>
