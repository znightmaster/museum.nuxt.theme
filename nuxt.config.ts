// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  // Приватные значения (доступны только на сервере, в браузер не попадают).
  // Заполняются через .env (см. .env.example) — локально из файла .env,
  // на Vercel/Netlify — через переменные окружения в настройках проекта.
  // Имя переменной окружения = NUXT_<КЛЮЧ_В_ВЕРХНЕМ_РЕГИСТРЕ>,
  // например supabaseServiceKey -> NUXT_SUPABASE_SERVICE_KEY.
  runtimeConfig: {
    supabaseUrl: '',
    supabaseServiceKey: '',
    supabaseBucket: 'media',
    adminPassword: '',
    sessionSecret: '',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      title: 'Музей советской техники — Яровое',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=PT+Sans:wght@400;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          // Применяем сохранённую тему до отрисовки страницы, чтобы избежать
          // мигания тёмной темой перед переключением на светлую.
          innerHTML: `(function(){try{var t=localStorage.getItem('museum-theme');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`,
        },
      ],
      bodyAttrs: {
        class: 'bg-bg text-fg font-body leading-relaxed',
      },
    },
  },
})
