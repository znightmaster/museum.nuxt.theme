export interface CollectionInput {
  tag: string
  title: string
  description?: string
  image?: string | null
  link?: string
  sort_order?: number
}

export async function listCollections() {
  const { data, error } = await getSupabase()
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function createCollection(input: CollectionInput) {
  const { data, error } = await getSupabase().from('collections').insert(input).select().single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function updateCollection(id: string, input: Partial<CollectionInput>) {
  const { data, error } = await getSupabase()
    .from('collections')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function deleteCollection(id: string) {
  const { error } = await getSupabase().from('collections').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
}
