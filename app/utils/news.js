// Сами посты редактируются через админку и хранятся в Supabase
// (см. server/api/news/index.get.ts, server/api/news/[slug].get.ts).
// Здесь остался только справочник категорий — набор фиксированный,
// через админку не редактируется.
export const newsCategories = {
  event: 'Событие',
  restoration: 'Реставрация',
  article: 'Статья',
}
