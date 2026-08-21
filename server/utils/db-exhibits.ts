export interface ExhibitSpec {
  k: string
  v: string
}

export interface ExhibitInput {
  num: string
  name: string
  year: string
  rotate?: number
  stamp?: string
  zal: string
  specs?: ExhibitSpec[]
  note?: string
  image?: string | null
  photos?: string[]
  legend?: string
  history?: string
  sort_order?: number
}

export async function listExhibits() {
  const { data, error } = await getSupabase()
    .from('exhibits')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function createExhibit(input: ExhibitInput) {
  const { data, error } = await getSupabase().from('exhibits').insert(input).select().single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function updateExhibit(id: string, input: Partial<ExhibitInput>) {
  const { data, error } = await getSupabase()
    .from('exhibits')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
}

export async function deleteExhibit(id: string) {
  const { error } = await getSupabase().from('exhibits').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
}
