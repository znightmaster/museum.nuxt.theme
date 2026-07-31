// Экспонаты, коллекции и предметы зала "Быт" теперь редактируются через
// админку и хранятся в Supabase (см. server/api/exhibits.get.ts,
// server/api/collections.get.ts, server/api/byt.get.ts). Здесь остались
// только вещи, которые не редактируются через админку.

export const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/exhibits', label: 'Экспонаты' },
  { to: '/byt', label: 'Быт СССР' },
  { to: '/news', label: 'Новости' },
  { to: '/visit', label: 'Как добраться' },
]

export const stats = [
  { num: '120+', label: 'единиц техники' },
  { num: '45', label: 'на ходу и заводятся' },
  { num: '1930–91', label: 'охваченный период' },
  { num: '6', label: 'тематических залов' },
]

export const hours = [
  { day: 'Понедельник — воскресенье', time: '10:00 — 20:00' },
  { day: 'Выходной', time: 'отсутствует' },
]

// Чертёж-заглушка на зал, пока у конкретного экспоната не задана своя
// картинка (поле image в карточке экспоната). Ключ — значение поля "zal".
// У каждого чертежа две версии: normal (светлые линии — для тёмной
// подложки карточки) и black (тёмные линии — для светлой подложки).
export const zalImages = {
  'Военная техника': { normal: '/luaz_profile.png', black: '/luaz_black_profile.png' },
  'Бронетехника': { normal: '/luaz_profile.png', black: '/luaz_black_profile.png' },
  'Ретро-автомобили': { normal: '/moskvich_profile.png', black: '/moskvich_black_profile.png' },
  'Мотоциклы': { normal: '/moto_profile_profile.png', black: '/moto_black_profile.png' },
  'Быт СССР': { normal: '/radiola.png', black: '/radiola_black.png' },
}

export function zalImage(exhibit) {
  return exhibit.image || zalImages[exhibit.zal]?.normal || null
}

// Возвращает пару { normal, black } для чертежа экспоната — либо по залу,
// либо (если у экспоната задана своя картинка через админку) выведенную
// из её имени файла по тому же соглашению "_black" перед расширением.
export function zalImageVariants(exhibit) {
  if (exhibit.image) {
    const match = exhibit.image.match(/^(.*?)(_black)?(\.[a-zA-Z0-9]+)$/)
    if (!match) return { normal: exhibit.image, black: exhibit.image }
    const [, base, , ext] = match
    return { normal: `${base}${ext}`, black: `${base}_black${ext}` }
  }
  return zalImages[exhibit.zal] || null
}
