import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file')

  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не передан (поле "file")' })
  }

  const MAX_SIZE = 8 * 1024 * 1024 // 8 МБ — картинке для сайта больше не нужно
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'Файл больше 8 МБ' })
  }

  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  const ext = extname(file.filename).toLowerCase()
  if (!allowedExt.includes(ext)) {
    throw createError({
      statusCode: 415,
      statusMessage: `Недопустимый формат файла: ${ext || 'неизвестен'}. Разрешены: ${allowedExt.join(', ')}`,
    })
  }

  const config = useRuntimeConfig()
  const bucket = config.supabaseBucket || 'media'
  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}${ext}`

  const { error: uploadError } = await getSupabase()
    .storage.from(bucket)
    .upload(path, file.data, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    throw createError({ statusCode: 500, statusMessage: `Не удалось загрузить файл: ${uploadError.message}` })
  }

  const { data } = getSupabase().storage.from(bucket).getPublicUrl(path)

  return { url: data.publicUrl }
})
