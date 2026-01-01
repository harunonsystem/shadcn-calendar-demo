import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { getWeekDays } from '@/lib/utils/date'

export const translations = {
  ja: {
    monthNames: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    // Sunday start order: ['日', '月', '火', '水', '木', '金', '土']
    weekDays: ['月', '火', '水', '木', '金', '土', '日'],
    weekDaysFull: ['日', '月', '火', '水', '木', '金', '土'], // 日曜始まり（標準配列）
    viewModes: { month: '月', week: '週', day: '日', category: 'カテゴリ' },
    addEvent: 'イベント追加',
    more: 'more',
    noEvents: 'イベントがありません',
    today: '今日',
  },
  en: {
    monthNames: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    // Sunday start order: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekDaysFull: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 日曜始まり（標準配列）
    viewModes: { month: 'Month', week: 'Week', day: 'Day', category: 'Category' },
    addEvent: 'Add Event',
    more: 'more',
    noEvents: 'No events',
    today: 'Today',
  },
}

// firstDayOfWeekに基づいて曜日ラベルをローテーション
// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
export const getWeekDayLabels = (language: Language, firstDayOfWeek: number = 0): string[] => {
  const fullWeekDays = translations[language].weekDaysFull // 日曜始まり
  // firstDayOfWeek分だけローテーション
  return [...fullWeekDays.slice(firstDayOfWeek), ...fullWeekDays.slice(0, firstDayOfWeek)]
}

// 曜日インデックス（0=日曜, 1=月曜, ...）から曜日名を取得
export const getWeekDayName = (language: Language, dayIndex: number): string => {
  return translations[language].weekDaysFull[dayIndex]
}


export const getEventStyle = (event: CalendarEvent, config?: CalendarConfig) => {
  // カテゴリ色設定があればそこから検索
  if (config?.categoryColors && event.category) {
    const categoryColor = config.categoryColors.find((c) => c.label === event.category)
    if (categoryColor) {
      return {
        backgroundColor: categoryColor.backgroundColor,
        borderColor: categoryColor.borderColor,
        border: `1px solid ${categoryColor.borderColor}`,
      }
    }
  }

  // デフォルトのスタイル（イベント個別の色 > デフォルト色）
  return {
    backgroundColor: event.backgroundColor || event.color || '#3b82f6',
    borderColor: event.borderColor || event.color || '#3b82f6',
    border: `1px solid ${event.borderColor || event.color || '#3b82f6'}`,
  }
}

export const getNowIndicatorPosition = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours * 60 + minutes
}

export const getTitle = (viewMode: string, currentDate: Date, language: Language) => {
  const t = translations[language]
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  if (viewMode === 'month') {
    return language === 'ja' ? `${year}年 ${t.monthNames[month]}` : `${t.monthNames[month]} ${year}`
  } else if (viewMode === 'week') {
    const weekDays = getWeekDays(currentDate)
    const start = weekDays[0]
    const end = weekDays[6]
    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
  } else if (viewMode === 'day') {
    return currentDate.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } else {
    return t.viewModes.category
  }
}
