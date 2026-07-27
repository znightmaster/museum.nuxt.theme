-- Схема базы данных музея.
-- Выполнить один раз в Supabase → SQL Editor нового проекта.
--
-- Таблицы отражают ту же структуру, что раньше лежала статикой
-- в app/utils/museum.js, app/utils/news.js и прямо в BytSection.vue.
-- sort_order определяет порядок карточек на сайте — админка позволяет
-- его менять (перетаскиванием/полем "порядок"), поэтому не полагаемся
-- на порядок id или created_at.

create extension if not exists "pgcrypto";

-- ===== Экспонаты (ExhibitsSection) =====
create table if not exists exhibits (
  id uuid primary key default gen_random_uuid(),
  num text not null,                -- инвентарный номер, например "014"
  name text not null,
  year text not null,
  rotate numeric not null default 0,-- небольшой наклон карточки в градусах, для верстки
  stamp text not null default '',
  zal text not null,                -- зал/категория, по которой фильтруются карточки
  specs jsonb not null default '[]',-- [{ k: "Двигатель", v: "2.1 л, 52 л.с." }, ...]
  note text not null default '',
  image text,                       -- URL картинки (из Supabase Storage) или NULL —
                                     -- тогда используется общая заглушка зала (zalImages)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ===== Коллекции/разделы на главной (CollectionsSection) =====
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  tag text not null,                -- "РАЗДЕЛ 01"
  title text not null,
  description text not null default '',
  image text,                       -- URL картинки
  link text not null default '/exhibits',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ===== Категории зала "Быт" (BytSection) =====
create table if not exists byt_categories (
  id uuid primary key default gen_random_uuid(),
  idx text not null,                -- "01", "02" ...
  group_name text not null,         -- "АУДИОТЕХНИКА", "БЫТ" и т.п.
  title text not null,
  count_label text not null default '', -- "34 экземпляра"
  years text not null default '',       -- "1955–1982"
  fact text not null default '',
  size text not null default 'small' check (size in ('small','wide','tall','large')),
  icon_svg text not null default '',    -- содержимое <svg>...</svg> для превью-иконки
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ===== Предметы внутри категории "Быт" (мини-галерея при раскрытии карточки) =====
create table if not exists byt_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references byt_categories(id) on delete cascade,
  name text not null,
  year text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ===== Новости/блог =====
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,           -- ключ категории, см. newsCategories
  date date not null,
  excerpt text not null default '',
  content jsonb not null default '[]', -- массив строк-абзацев
  image text,                       -- обложка поста, URL; если NULL — используется cover
  cover text not null default 'default', -- вариант заглушки NewsCoverArt, если image не задан
  gallery jsonb not null default '[]',   -- массив URL картинок для NewsGallery
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists byt_items_category_id_idx on byt_items(category_id);
create index if not exists news_posts_date_idx on news_posts(date desc);

-- Хранилище файлов: создайте в Supabase → Storage бакет с именем "media"
-- (или другим — тогда укажите его в NUXT_SUPABASE_BUCKET) и включите
-- "Public bucket" в его настройках, чтобы картинки открывались по прямой ссылке.
