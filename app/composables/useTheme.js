// Управление темой оформления (тёмная/светлая).
// Тёмная — оригинальный вид проекта, применяется по умолчанию.
// Выбор пользователя сохраняется в localStorage и переживает перезагрузку страницы.

const STORAGE_KEY = 'museum-theme'

export function useTheme() {
  // useState — общее реактивное состояние на всё приложение (без дублирования при SSR)
  const theme = useState('theme', () => 'dark')

  function applyTheme(value) {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', value)
    }
  }

  function setTheme(value) {
    theme.value = value
    applyTheme(value)
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch (e) {
        // localStorage может быть недоступен (приватный режим и т.п.) — не критично
      }
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    if (!import.meta.client) return
    let saved = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch (e) {
      // игнорируем
    }
    const value = saved === 'light' || saved === 'dark' ? saved : 'dark'
    theme.value = value
    applyTheme(value)
  }

  return { theme, setTheme, toggleTheme, initTheme }
}
