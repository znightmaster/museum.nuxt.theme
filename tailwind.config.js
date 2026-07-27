/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Фоны — переключаются между тёмной и светлой темой (см. main.css)
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',

        // Приглушённые акценты — тоже переключаются
        khaki: 'rgb(var(--color-khaki) / <alpha-value>)',
        steel: 'rgb(var(--color-steel) / <alpha-value>)',

        // Основной текст переднего плана — переключается (тёмный на светлом фоне и наоборот)
        fg: 'rgb(var(--color-fg) / <alpha-value>)',
        fgdim: 'rgb(var(--color-fgdim) / <alpha-value>)',

        // Фирменный красный — не меняется между темами
        rust: 'rgb(var(--color-rust) / <alpha-value>)',
        rustdim: 'rgb(var(--color-rustdim) / <alpha-value>)',
        rustlight: 'rgb(var(--color-rustlight) / <alpha-value>)',

        // Фиксированные светлые оттенки — используются как цвет текста/фона
        // на красных и других всегда-тёмных плашках, не зависят от темы
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        paperdim: 'rgb(var(--color-paperdim) / <alpha-value>)',

        hline: 'var(--color-hline)',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['"PT Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
