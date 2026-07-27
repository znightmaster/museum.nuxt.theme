// Подбирает "чёрную" версию картинки (с припиской _black) для светлой темы.
// Пример: /luaz.png -> /luaz_black.png, когда theme === 'light'.
// Если файла с _black не существует (например, картинка загружена через
// админку и такой версии для неё нет), <img @error> в месте использования
// откатит src обратно на оригинал — см. helper `themedImgFallback`.

export function useThemedImage() {
  const { theme } = useTheme()

  function themed(path) {
    if (!path) return path
    if (theme.value !== 'light') return path

    const match = path.match(/^(.*)(\.[a-zA-Z0-9]+)$/)
    if (!match) return path

    const [, base, ext] = match
    if (base.endsWith('_black')) return path

    return `${base}_black${ext}`
  }

  // Обработчик @error для <img>: если _black-версия не найдена (404),
  // откатываемся на исходный путь, чтобы картинка не пропадала.
  function themedImgFallback(event, originalPath) {
    if (event.target.src !== originalPath) {
      event.target.src = originalPath
    }
  }

  return { theme, themed, themedImgFallback }
}
