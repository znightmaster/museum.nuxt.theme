export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body?.category_id || !body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Обязательны поля: category_id, name' })
  }

  return await createBytItem(body)
})
