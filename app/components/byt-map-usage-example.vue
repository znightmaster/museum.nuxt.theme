<template>
  <BuildingBlueprintMap :items="mapItems" />
</template>

<script setup>
import BuildingBlueprintMap from '~/components/BuildingBlueprintMap.vue'

// x/y — % от внутренней площади плана здания (0-100 по каждой оси).
// Здание вытянуто по длине (60 м), поэтому x обычно 5-95, y — 15-85,
// с учётом того что вход слева, лестницы в середине и ближе к правому концу.

const mapItems = [
  // --- этаж 1 ---
  {
    id: 'car-1',
    floor: 1,
    type: 'car',
    x: 15,
    y: 30,
    title: 'Ретро-автомобили: «Волга», «Победа»',
  },
  {
    id: 'car-2',
    floor: 1,
    type: 'car',
    x: 15,
    y: 70,
    title: 'Мотоциклы',
  },
  {
    id: 'radiola',
    floor: 1,
    type: 'exhibit',
    x: 40,
    y: 25,
    title: 'Радиола',
    subtitle: '34 экземпляра, 1955–1982',
    photos: [
      '/images/byt/radiola-1.jpg',
      '/images/byt/radiola-2.jpg',
      '/images/byt/radiola-3.jpg',
    ],
  },
  {
    id: 'samovar',
    floor: 1,
    type: 'exhibit',
    x: 60,
    y: 70,
    title: 'Самовар',
    subtitle: '21 экземпляр, 1930–1970-е',
    photos: ['/images/byt/samovar-1.jpg', '/images/byt/samovar-2.jpg'],
  },

  // --- этаж 2 ---
  {
    id: 'car-3',
    floor: 2,
    type: 'car',
    x: 20,
    y: 30,
    title: 'Военная техника (макеты)',
  },
  {
    id: 'tv',
    floor: 2,
    type: 'exhibit',
    x: 45,
    y: 70,
    title: 'Телевизор',
    subtitle: '18 экземпляров, 1961–1988',
    photos: ['/images/byt/tv-1.jpg', '/images/byt/tv-2.jpg'],
  },
  {
    id: 'clock',
    floor: 2,
    type: 'exhibit',
    x: 70,
    y: 30,
    title: 'Настенные часы',
    subtitle: '27 экземпляров, 1950–1985',
    photos: ['/images/byt/clock-1.jpg'],
  },

  // --- этаж 3 ---
  {
    id: 'toys',
    floor: 3,
    type: 'exhibit',
    x: 35,
    y: 30,
    title: 'Игрушки',
    subtitle: '140+ экземпляров, 1950–1991',
    photos: ['/images/byt/toys-1.jpg', '/images/byt/toys-2.jpg', '/images/byt/toys-3.jpg'],
  },
  {
    id: 'pioneer-tie',
    floor: 3,
    type: 'exhibit',
    x: 65,
    y: 65,
    title: 'Пионерский галстук',
    subtitle: '12 экземпляров, 1960–1989',
    photos: ['/images/byt/tie-1.jpg'],
  },
]
</script>
