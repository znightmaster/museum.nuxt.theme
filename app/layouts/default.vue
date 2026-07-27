<template>
  <div class="bg-bg min-h-screen">

    <TheNavbar />

    <!-- Сюда подставляется содержимое текущей страницы -->
    <main class="bg-hero-fade">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>
