<script setup>
import { hours } from '~/utils/museum.js'

const { themed, themedImgFallback } = useThemedImage()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-14">
    <div>
      <div class="border-t border-hline pt-5 mb-6.5">
        <div class="font-mono text-[11.5px] text-rust uppercase tracking-wider mb-2.5">Часы работы</div>
        <table class="w-full border-collapse text-[14.5px]">
          <tr v-for="row in hours" :key="row.day" class="border-t border-hline">
            <td class="py-2.5 text-fgdim font-mono text-[12.5px]">{{ row.day }}</td>
            <td class="py-2.5 text-right">{{ row.time }}</td>
          </tr>
        </table>
      </div>

      <div class="border-t border-hline pt-5 mb-6.5">
        <div class="font-mono text-[11.5px] text-rust uppercase tracking-wider mb-2.5">Билеты</div>
        <div class="text-[15.5px]">
          Взрослый — 500 ₽<br />Детский — 400 ₽
          <small class="block text-fgdim text-[13px] mt-1">
            Дети до 7 лет — бесплатно. Экскурсия с гидом — +150 ₽ к билету.
          </small>
        </div>
      </div>

      <div class="border-t border-hline pt-5 mb-6.5">
        <div class="font-mono text-[11.5px] text-rust uppercase tracking-wider mb-2.5">Адрес</div>
        <div class="text-[15.5px]">
          г. Яровое, Алтайский край
          <small class="block text-fgdim text-[13px] mt-1">
          </small>
        </div>
      </div>
    </div>

    <div class="border-t border-hline  flex items-center justify-center">
      <img
          :src="themed('/photo.png')"
          alt="Здание музея, архивное фото"
          class="w-auto max-w-full max-h-[400px] object-contain"
          @error="themedImgFallback($event, '/photo.png')"
      />
    </div>
  </div>
</template>