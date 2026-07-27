export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const post = await getNewsById(id)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Пост не найден' })
  return post
})
