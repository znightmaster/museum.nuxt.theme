# Музей советской техники — Яровое (Nuxt 4)

Проект переведён с Vite + Vue Router на **Nuxt 4**.

## Установка и запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:3000`.

Продакшн-сборка:

```bash
npm run build
npm run preview
```

## Что изменилось при переносе с Vite

- **Роутинг**: файловый (`app/pages/`) вместо ручного `src/router/index.js`.
  - `HomeView.vue` → `app/pages/index.vue`
  - `ExhibitsView.vue` → `app/pages/exhibits.vue`
  - `BytView.vue` → `app/pages/byt.vue`
  - `VisitView.vue` → `app/pages/visit.vue`
  - `NewsView.vue` → `app/pages/news/index.vue`
  - `NewsPostView.vue` (`/news/:slug`) → `app/pages/news/[slug].vue`
  - `NotFoundView.vue` → `app/error.vue` (глобальная страница ошибок Nuxt, срабатывает и на 404, и на прочие ошибки)
- **`src/App.vue` + `src/main.js`** → `app/app.vue` (просто `<NuxtLayout><NuxtPage /></NuxtLayout>`) + `app/layouts/default.vue` (навбар/подвал переехали сюда, чтобы у `/admin` мог быть свой отдельный layout — см. раздел «Админка» ниже)
- **Компоненты** (`src/components/*.vue`) перенесены в `app/components/` без изменений — Nuxt подключает их автоматически, явные импорты не нужны.
  - Убран `src/components/NewsPostView.vue` — это был неиспользуемый дубль `views/NewsPostView.vue` (отличался только пробелами), в роутинге не участвовал.
- **Данные** (`src/data/museum.js`, `src/data/news.js`) → `app/utils/museum.js`, `app/utils/news.js`. Импорты вида `../data/museum.js` заменены на `~/utils/museum.js`. Часть данных (экспонаты, коллекции, «Быт», новости) с появлением админки переехала из этих файлов в Supabase — подробности в разделе «Админка».
- **`<router-link>`** заменён на **`<NuxtLink>`** везде (drop-in замена, поддерживает те же пропсы `active-class`/`exact-active-class`).
- **`useRoute()`** больше не импортируется из `vue-router` — в Nuxt это глобальный автоимпорт, как и `ref`/`computed`.
- **Статика** из `public/` перенесена как есть — Nuxt отдаёт её из корневого `public/` точно так же, как Vite.
- **Tailwind**: тот же `tailwind.config.js` (только пути `content` указывают на `app/**/*`), подключён через официальный модуль `@nuxtjs/tailwindcss` — он сам настраивает PostCSS, отдельный `postcss.config.js` не нужен.
- **Шрифты Google Fonts и `<title>`**, которые раньше были в `index.html`, перенесены в `nuxt.config.ts` → `app.head`.
- **`html { scroll-behavior: smooth }`**, маски `.gaz69`/`.bm13` и остальные кастомные стили — без изменений, просто переехали в `app/assets/css/main.css`.

## Структура

```
app/
  app.vue              # <NuxtLayout><NuxtPage /></NuxtLayout>
  error.vue            # страница 404 / ошибок
  layouts/
    default.vue        # навбар + подвал — обычные страницы сайта
    admin.vue           # отдельная шапка для /admin
  pages/               # файловый роутинг (включая /admin, см. ниже)
  components/          # авто-импортируемые компоненты
  middleware/admin.ts   # защита страниц /admin/**
  utils/               # оставшиеся статичные данные (навигация, часы, категории новостей)
  assets/css/main.css  # Tailwind + кастомные стили
public/                # статика (картинки, favicon)
server/                # API для админки и публичных данных, см. «Админка» ниже
supabase/schema.sql     # SQL-схема базы
scripts/seed.mjs        # разовый перенос контента в базу
nuxt.config.ts
tailwind.config.js
```

## Важно

Каталог `node_modules` не переносился — после распаковки нужно выполнить `npm install`. Я не запускал `npm install` и сборку в своей среде (нет доступа к сети), поэтому после установки зависимостей стоит один раз прогнать `npm run dev` и проверить все страницы (особенно `Map.vue`/лайтбокс и мобильное меню в `TheNavbar.vue`).

---

## Админка (`/admin`)

Экспонаты, разделы экспозиции, категории и предметы зала «Быт», а также новости теперь редактируются через `/admin` и хранятся в **Supabase** (Postgres + Storage для картинок). Статичными (не через админку) остались только навигация, шапка-статистика на главной, часы работы и справочник категорий новостей — они по-прежнему лежат в `app/utils/museum.js` и `app/utils/news.js`.

### 1. Создать проект в Supabase

1. Зарегистрируйтесь на [supabase.com](https://supabase.com) и создайте новый проект (бесплатного тарифа достаточно).
2. Откройте **SQL Editor** → вставьте содержимое `supabase/schema.sql` из этого репозитория → Run. Это создаст все нужные таблицы.
3. Откройте **Storage** → создайте бакет с именем `media` → включите у него **Public bucket** (иначе картинки не будут открываться по прямой ссылке).
4. Откройте **Project Settings → Data API** — скопируйте `Project URL`.
5. Откройте **Project Settings → API Keys** — скопируйте ключ **service_role** (не `anon`! у service_role полный доступ к базе, поэтому он используется только на сервере и никогда не должен попасть в браузер или в git).

### 2. Заполнить переменные окружения

```bash
cp .env.example .env
```

и заполните в `.env`:

- `NUXT_SUPABASE_URL` — Project URL из шага 1.4
- `NUXT_SUPABASE_SERVICE_KEY` — service_role ключ из шага 1.5
- `NUXT_SUPABASE_BUCKET` — `media` (если называли бакет иначе — своё имя)
- `NUXT_ADMIN_PASSWORD` — придумайте пароль для входа в `/admin`
- `NUXT_SESSION_SECRET` — любая длинная случайная строка, например результат `openssl rand -hex 32`

На хостинге (Vercel/Netlify) те же переменные нужно продублировать в настройках проекта — `.env` туда не попадает (он в `.gitignore`).

### 3. Перенести текущий контент в базу (один раз)

```bash
npm install
npm run seed
```

Скрипт `scripts/seed.mjs` один раз загрузит в Supabase те же экспонаты, разделы, категории/предметы «Быта» и новости, что сейчас в статике — сайт после подключения базы будет выглядеть так же, как сейчас. Повторный запуск создаст дубли, так что запускайте один раз (или очистите таблицы перед повторным запуском).

### 4. Пользоваться

```bash
npm run dev
```

Откройте `http://localhost:3000/admin`, войдите по паролю из `NUXT_ADMIN_PASSWORD`. Дальше — разделы «Экспонаты», «Разделы экспозиции», «Быт», «Новости»: список → «Добавить»/«Изменить» → форма с загрузкой картинок прямо из браузера (кнопка «Загрузить файл» отправляет файл в Supabase Storage и подставляет ссылку).

### Как это работает технически

- **Публичные страницы** (`/`, `/exhibits`, `/byt`, `/news`) через `useFetch` берут данные с `GET /api/exhibits`, `/api/collections`, `/api/byt`, `/api/news` — эти роуты просто читают Supabase и ничего не требуют для авторизации.
- **Авторизация в админке** — без внешнего auth-сервиса: пароль сверяется на сервере (`server/api/admin/login.post.ts`), в ответ ставится подписанная `httpOnly` cookie (`server/utils/auth.ts`). Каждый `/api/admin/**` роут вызывает `requireAdmin(event)` в начале и отдаёт 401, если cookie нет/просрочена/подделана.
- **Защита страниц `/admin/**`** — `app/middleware/admin.ts` перед рендером страницы дергает `GET /api/admin/me`; если он падает — редирект на `/admin/login`.
- **Загрузка картинок** — `POST /api/admin/upload` принимает файл (до 8 МБ, jpg/png/webp/gif/svg), кладёт в бакет `media` и возвращает публичную ссылку, которая тут же сохраняется в поле `image`/`gallery` записи.
- Почему это работает и на статическом хостинге типа Vercel/Netlify: Nuxt при сборке под эти платформы автоматически превращает `server/api/**` в serverless-функции — отдельный постоянно работающий сервер не нужен.

### Структура серверной части

```
supabase/schema.sql        # SQL-схема (выполнить один раз в Supabase)
scripts/seed.mjs           # разовый перенос текущего контента в базу (npm run seed)
server/
  utils/
    supabase.ts            # серверный клиент Supabase (service-role, только на сервере)
    auth.ts                # проверка пароля + подписанная cookie-сессия
    db-exhibits.ts         # CRUD-функции для каждой сущности…
    db-collections.ts
    db-byt.ts
    db-news.ts
  api/
    exhibits.get.ts        # публичные роуты чтения
    collections.get.ts
    byt.get.ts
    news/index.get.ts
    news/[slug].get.ts
    admin/                 # всё здесь защищено requireAdmin()
      login.post.ts, logout.post.ts, me.get.ts, upload.post.ts
      exhibits/, collections/, byt/categories/, byt/items/, news/
app/
  middleware/admin.ts       # защита страниц /admin/**
  layouts/
    default.vue             # обычный сайт (навбар + подвал)
    admin.vue                # своя шапка для /admin, без публичного навбара
  components/admin/
    ImageUploader.vue         # виджет загрузки картинки в Supabase Storage
  pages/admin/
    login.vue, index.vue
    exhibits/index.vue, exhibits/[id].vue      # [id] = 'new' для создания
    collections/index.vue, collections/[id].vue
    byt/index.vue, byt/[id].vue                # категория + её предметы на одной странице
    news/index.vue, news/[id].vue
```
