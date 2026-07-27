<script setup>
const props = defineProps({
  error: Object,
})

const isNotFound = computed(() => props.error?.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="bg-bg min-h-screen">
    <TheNavbar />
    <main class="bg-hero-fade">
      <section class="py-32">
        <div class="max-w-[1180px] mx-auto px-8 text-center">
          <div class="font-mono text-rust text-sm uppercase tracking-[0.14em] mb-4">
            {{ isNotFound ? 'Ошибка 404' : `Ошибка ${error?.statusCode ?? ''}` }}
          </div>
          <h1 class="font-display uppercase text-[40px] md:text-[56px] mb-6">
            {{ isNotFound ? 'Экспонат не найден' : 'Что-то пошло не так' }}
          </h1>
          <p class="text-fgdim mb-10">
            {{
              isNotFound
                ? 'Такой страницы не существует — возможно, она переехала или адрес введён неверно.'
                : 'Попробуйте обновить страницу или вернуться на главную.'
            }}
          </p>
          <button
            type="button"
            @click="goHome"
            class="font-mono text-[13px] uppercase tracking-wider px-6 py-4 rounded-sm bg-rust text-paper hover:bg-rustlight transition-colors inline-block"
          >
            На главную
          </button>
        </div>
      </section>
    </main>
    <TheFooter />
  </div>
</template>
