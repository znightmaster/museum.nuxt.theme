export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body?.slug || !body?.title || !body?.category || !body?.date) {
    throw createError({ statusCode: 400, statusMessage: 'Обязательны поля: slug, title, category, date' })
  }

  return await createNews(body)
})
