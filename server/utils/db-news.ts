export interface NewsPostInput {
  slug: string
  title: string
  category: string
  date: string // 'YYYY-MM-DD'
  excerpt?: string
  content?: string[]
  image?: string | null
  cover?: string
  gallery?: string[]
  published?: boolean
  sort_order?: number
}

// includeUnpublished: используется в админке, чтобы видеть черновики.
// На публичном сайте всегда false — неопубликованные посты не показываем.
export async function listNews(includeUnpublished = false) {
  let query = getSupabase().from('news_posts').select('*').order('date', { ascending: false })

  if (!includeUnpublished) query = query.eq('published', true)

  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function getNewsBySlug(slug: string, includeUnpublished = false) {
  let query = getSupabase().from('news_posts').select('*').eq('slug', slug)

  if (!includeUnpublished) query = query.eq('published', true)

  const { data, error } = await query.maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function getNewsById(id: string) {
  const { data, error } = await getSupabase().from('news_posts').select('*').eq('id', id).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function createNews(input: NewsPostInput) {
  const { data, error } = await getSupabase().from('news_posts').insert(input).select().single()
  if (error) {
    // unique-констрейнт на slug — частая ошибка при ручном вводе, отдаём понятный текст
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Такой slug уже занят другим постом.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
}

export async function updateNews(id: string, input: Partial<NewsPostInput>) {
  const { data, error } = await getSupabase()
    .from('news_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Такой slug уже занят другим постом.' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
}

export async function deleteNews(id: string) {
  const { error } = await getSupabase().from('news_posts').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
}
