export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug обязателен' })

  const post = await getNewsBySlug(slug, false)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Пост не найден' })

  return post
})
