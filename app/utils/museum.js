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
export const zalImages = {
  'Военная техника': '/luaz.png',
  'Бронетехника': '/luaz.png',
  'Ретро-автомобили': '/moskvich.png',
  'Мотоциклы': '/moto.png',
  'Быт СССР': '/radiola.png',
}

export function zalImage(exhibit) {
  return exhibit.image || zalImages[exhibit.zal] || null
}
