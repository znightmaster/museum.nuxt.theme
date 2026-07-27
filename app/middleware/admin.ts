// Подключается на каждой защищённой странице явно:
// definePageMeta({ middleware: 'admin' })
// (не глобальный, чтобы страница логина осталась без него).
export default defineNuxtRouteMiddleware(async () => {
  try {
    // $fetch изоморфный: и на сервере, и в браузере он отправит ту же
    // httpOnly cookie сессии, что установил /api/admin/login.
    await $fetch('/api/admin/me')
  } catch {
    return navigateTo('/admin/login')
  }
})
