export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body?.name || !body?.zal || !body?.num || !body?.year) {
    throw createError({ statusCode: 400, statusMessage: 'Обязательны поля: num, name, year, zal' })
  }

  return await createExhibit(body)
})
