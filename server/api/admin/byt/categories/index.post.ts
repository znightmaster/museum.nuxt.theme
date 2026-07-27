export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body?.title || !body?.group_name || !body?.idx) {
    throw createError({ statusCode: 400, statusMessage: 'Обязательны поля: idx, group_name, title' })
  }

  return await createBytCategory(body)
})
