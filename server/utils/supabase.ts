import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Один клиент на весь процесс сервера — пересоздавать его на каждый запрос
// не нужно, supabase-js сам умеет работать в конкурентных запросах.
// ВАЖНО: используется service_role ключ, у него полный доступ к базе в обход
// Row Level Security. Именно поэтому этот файл лежит в server/ — Nitro
// никогда не отдаёт код из server/ в браузер, ключ туда не попадёт.
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client

  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Supabase не настроен: заполните NUXT_SUPABASE_URL и NUXT_SUPABASE_SERVICE_KEY (см. .env.example).',
    })
  }

  client = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false },
  })

  return client
}
