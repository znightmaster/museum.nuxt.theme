<template>
  <header class="relative overflow-hidden border-b border-hline bg-gradient-to-b from-surface to-bg">
    <div
      class="absolute inset-0 opacity-40"
      style="background: radial-gradient(ellipse at 20% -10%, rgba(161, 51, 40, 0.18), transparent 55%)"
    ></div>
    <div class="max-w-[1180px] mx-auto px-8 relative grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-10 items-center py-16 md:py-24">      <div>
        <div class="flex items-center gap-2.5 font-mono text-[12.5px] tracking-[0.14em] text-rust uppercase mb-5">
          <span class="w-6 h-px bg-rust"></span>
          Яровое · Алтайский край
        </div>
        <h1 class="font-display font-bold uppercase leading-[1.10] text-[40px] md:text-[64px] lg:text-[78px] mb-5 ">
          Техника,<br />которая
          <span class="block text-rust">всё ещё на ходу.</span>
        </h1>
        <p class="text-fgdim text-[17px] max-w-[46ch] mb-8">
          Более 120 единиц военной и гражданской техники советской эпохи — бронетранспортёры,
          ретро-автомобили в отреставрированном состоянии, мотоциклы и предметы быта. Каждый
          экспонат можно рассмотреть вблизи, а часть машин заводится и выезжает на площадку в дни
          фестивалей.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="#visit-info"
            class="font-mono text-[13px] uppercase tracking-wider px-6 py-4 rounded-sm bg-rust text-paper hover:bg-rustlight hover: transition-all inline-flex items-center gap-2.5"
          >
            Билеты и часы работы
          </a>
          <NuxtLink
            to="/exhibits"
            class="font-mono text-[13px] uppercase tracking-wider px-6 py-4 rounded-sm border border-hline text-fgdim hover:text-fg hover:border-fgdim hover: transition-all inline-flex items-center gap-2.5"
          >
            Смотреть коллекцию
          </NuxtLink>
        </div>
      </div>

      <div class="justify-self-end w-full max-w-[440px] relative border border-hline bg-surface p-6">
        <div class="absolute inset-2 border border-dashed border-fg/20 pointer-events-none"></div>
        <div class="font-mono text-[11px] text-steel tracking-wider mb-3">ЭКСПОНАТ № 014 / БМ-13</div>
        <div class="bm13 transition-colors duration-300 hover:bg-rust"></div>
        <div class="font-display uppercase text-[15px] mb-1.5">Реактивная артиллерия БМ-13</div>
        <div class="text-[12.5px] text-fgdim">Открытая площадка, сектор «Военная техника»</div>
      </div>
    </div>
  </header>
</template>

