// Эффект "печатающегося текста" — используется в мини-окне экспоната
// для подразделов "Легенда" / "История": текст печатается посимвольно,
// как будто его набирают на машинке, что вписывается в архивную
// стилистику сайта (техпаспорт, картотека).

export function useTypewriter() {
  const displayed = ref('')
  const isTyping = ref(false)
  let timer = null
  let fullText = ''
  let i = 0

  // Скорость печати — лёгкая случайность, чтобы не выглядело механически.
  const BASE_DELAY = 14
  const JITTER = 18
  // На знаках препинания — небольшая пауза, как будто печатающий задумался.
  const PAUSE_CHARS = new Set(['.', ',', '—', '!', '?', ':', ';'])

  function stop() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function tick() {
    if (i >= fullText.length) {
      isTyping.value = false
      timer = null
      return
    }
    const ch = fullText[i]
    displayed.value += ch
    i += 1
    const delay = BASE_DELAY + Math.random() * JITTER + (PAUSE_CHARS.has(ch) ? 220 : 0)
    timer = setTimeout(tick, delay)
  }

  // Запускает печать текста с нуля (используется при переключении подраздела).
  function type(text) {
    stop()
    fullText = text || ''
    i = 0
    displayed.value = ''
    isTyping.value = true
    if (!fullText) {
      isTyping.value = false
      return
    }
    tick()
  }

  // Пропустить анимацию и сразу показать весь текст (клик по тексту во время печати).
  function skip() {
    stop()
    displayed.value = fullText
    isTyping.value = false
  }

  function reset() {
    stop()
    displayed.value = ''
    isTyping.value = false
    fullText = ''
    i = 0
  }

  onScopeDispose(() => stop())

  return { displayed, isTyping, type, skip, reset }
}
