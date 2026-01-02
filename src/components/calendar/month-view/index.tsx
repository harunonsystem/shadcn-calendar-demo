import { useAtomValue } from 'jotai'
import { Badge } from '@/components/ui/badge'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { getMonthDays, isToday } from '@/lib/utils/date'
import { getEventsForDate } from '@/lib/utils/event'
import { cn } from '@/lib/utils'
import { getEventStyle, getWeekDayLabels } from '../calendar-utils'
import { getTranslation } from '@/lib/i18n'
import { getMonthEventTitle } from '@/lib/utils/time'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'

interface MonthViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
}

export function MonthView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
  onEventClick,
  onDateClick,
}: MonthViewProps) {
  // Jotai atomsからデフォルト値を取得、propsがあればそちらを優先
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const atomEvents = useAtomValue(eventsAtom)
  const atomConfig = useAtomValue(configAtom)

  const currentDate = propCurrentDate ?? atomCurrentDate
  const events = propEvents ?? atomEvents
  const config = propConfig ?? atomConfig

  const t = getTranslation(language)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthDays = getMonthDays(year, month)

  // firstDayOfWeekに基づく曜日ラベル（デフォルト: 0 = 日曜始まり）
  const weekDayLabels = getWeekDayLabels(language, config.firstDayOfWeek ?? 0)

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDayLabels.map((day) => (
        <div key={day} className="p-2 text-center font-semibold text-muted-foreground">
          {day}
        </div>
      ))}
      {monthDays.map((date) => {
        // 共通フィルタリング関数を使用
        const dayEvents = getEventsForDate(events, date)
        return (
          <div
            key={date.toISOString()}
            className={cn(
              'min-h-24 p-2 border rounded-md cursor-pointer hover:bg-accent relative',
              isToday(date) && 'bg-primary/10 border-primary',
            )}
            onClick={() => onDateClick?.(date)}
          >
            <div className={cn('text-sm font-medium', isToday(date) && 'text-primary font-bold')}>
              {date.getDate()}
            </div>
            <div className="space-y-1 mt-1">
              {dayEvents.slice(0, 2).map((event) => (
                <Badge
                  key={event.id}
                  variant="secondary"
                  className="text-xs truncate block cursor-pointer"
                  style={getEventStyle(event, config)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick?.(event)
                  }}
                >
                  <div className="font-semibold text-white truncate">
                    {getMonthEventTitle(event)}
                  </div>
                </Badge>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayEvents.length - 2} {t.more}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
