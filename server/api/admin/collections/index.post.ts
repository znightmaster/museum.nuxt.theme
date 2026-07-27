export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body?.tag || !body?.title) {
    throw createError({ statusCode: 400, statusMessage: 'Обязательны поля: tag, title' })
  }

  return await createCollection(body)
})
