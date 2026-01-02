import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { getWeekDays } from '@/lib/utils/date'
import { getTranslation, getWeekDayLabels, getWeekDayName } from '@/lib/i18n'
import { DEFAULT_EVENT_COLOR, DEFAULT_BORDER_COLOR } from '@/lib/constants'

// Re-export for backward compatibility
export { getWeekDayLabels, getWeekDayName }

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
    backgroundColor: event.backgroundColor || event.color || DEFAULT_EVENT_COLOR,
    borderColor: event.borderColor || event.color || DEFAULT_BORDER_COLOR,
    border: `1px solid ${event.borderColor || event.color || DEFAULT_BORDER_COLOR}`,
  }
}

export const getNowIndicatorPosition = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours * 60 + minutes
}

export const getTitle = (viewMode: string, currentDate: Date, language: Language) => {
  const t = getTranslation(language)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  if (viewMode === 'month') {
    // フォーマットパターンを使用: '{year}年 {month}' or '{month} {year}'
    return t.formats.monthYear
      .replace('{year}', String(year))
      .replace('{month}', t.monthNames[month])
  } else if (viewMode === 'week') {
    const weekDays = getWeekDays(currentDate)
    const start = weekDays[0]
    const end = weekDays[6]
    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
  } else if (viewMode === 'day' || viewMode === 'category') {
    // day と category は同じ日付表示
    return currentDate.toLocaleDateString(t.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } else {
    return ''
  }
}
