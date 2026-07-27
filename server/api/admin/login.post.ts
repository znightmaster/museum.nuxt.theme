export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ password?: string }>(event)

  if (!config.adminPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_ADMIN_PASSWORD не задан на сервере — см. .env.example.',
    })
  }

  if (!body?.password || body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

  createSessionCookie(event)
  return { ok: true }
})
