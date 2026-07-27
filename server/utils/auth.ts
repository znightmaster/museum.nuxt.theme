import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

// Простая проверка пароля без внешнего сервиса авторизации: пользователь
// один (владелец музея), поэтому вместо базы сессий подписываем токен
// секретом (NUXT_SESSION_SECRET) и кладём его в httpOnly cookie.
// Подделать такой токен без секрета нельзя, а хранить его на сервере
// (в базе/файле) незачем — подпись сама себя проверяет.

const COOKIE_NAME = 'museum_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // неделя

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function getSecret() {
  const config = useRuntimeConfig()
  if (!config.sessionSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_SESSION_SECRET не задан — см. .env.example.',
    })
  }
  return config.sessionSecret
}

export function createSessionCookie(event: H3Event) {
  const secret = getSecret()
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000
  const payload = String(expiresAt)
  const signature = sign(payload, secret)
  const token = `${payload}.${signature}`

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    // secure отключаем только в dev (http://localhost), иначе браузер
    // просто не примет cookie на не-https адресе.
    secure: !import.meta.dev,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export function isAdminAuthenticated(event: H3Event): boolean {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const secret = getSecret()
  const expected = sign(payload, secret)

  // timingSafeEqual требует буферы одинаковой длины
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}

// Бросает 401, если сессии нет — использовать в начале каждого
// защищённого /api/admin/** обработчика.
export function requireAdmin(event: H3Event) {
  if (!isAdminAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Не авторизовано' })
  }
}
