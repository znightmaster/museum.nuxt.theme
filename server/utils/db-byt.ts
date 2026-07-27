export interface BytCategoryInput {
  idx: string
  group_name: string
  title: string
  count_label?: string
  years?: string
  fact?: string
  size?: 'small' | 'wide' | 'tall' | 'large'
  icon_svg?: string
  sort_order?: number
}

export interface BytItemInput {
  category_id: string
  name: string
  year?: string
  sort_order?: number
}

// Публичная страница получает категории вместе со вложенными предметами
// одним запросом — Supabase умеет отдавать связанные таблицы через select
// с именем внешнего ключа.
export async function listBytCategoriesWithItems() {
  const { data, error } = await getSupabase()
    .from('byt_categories')
    .select('*, items:byt_items(*)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('sort_order', { referencedTable: 'byt_items', ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function createBytCategory(input: BytCategoryInput) {
  const { data, error } = await getSupabase().from('byt_categories').insert(input).select().single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function updateBytCategory(id: string, input: Partial<BytCategoryInput>) {
  const { data, error } = await getSupabase()
    .from('byt_categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function deleteBytCategory(id: string) {
  // предметы категории удалятся сами: FK byt_items.category_id объявлен
  // как "on delete cascade" в supabase/schema.sql
  const { error } = await getSupabase().from('byt_categories').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
}

export async function createBytItem(input: BytItemInput) {
  const { data, error } = await getSupabase().from('byt_items').insert(input).select().single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function updateBytItem(id: string, input: Partial<BytItemInput>) {
  const { data, error } = await getSupabase()
    .from('byt_items')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function deleteBytItem(id: string) {
  const { error } = await getSupabase().from('byt_items').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
}
