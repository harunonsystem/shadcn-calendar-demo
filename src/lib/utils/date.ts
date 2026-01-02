export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const getMonthDays = (year: number, month: number): Date[] => {
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  return days
}

export const getWeekDays = (date: Date, firstDayOfWeek: number = 1): Date[] => {
  const startOfWeek = new Date(date)
  const currentDay = startOfWeek.getDay()

  let diff = currentDay - firstDayOfWeek
  if (diff < 0) diff += 7

  startOfWeek.setDate(date.getDate() - diff)

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push(day)
  }

  return days
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}
