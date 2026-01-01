import { useAtomValue } from 'jotai'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { TimeGrid } from './time-grid'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'
import { getUniqueCategories } from '@/lib/utils/event'

interface CategoryViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
}

export function CategoryView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
  onEventClick,
  onEventDrop,
  onEventResize,
}: CategoryViewProps) {
  // Jotai atomsからデフォルト値を取得、propsがあればそちらを優先
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const atomEvents = useAtomValue(eventsAtom)
  const atomConfig = useAtomValue(configAtom)

  const currentDate = propCurrentDate ?? atomCurrentDate
  const events = propEvents ?? atomEvents
  const config = propConfig ?? atomConfig

  // 共通関数でカテゴリ一覧を取得
  const categories = getUniqueCategories(events)

  // カテゴリごとに仮想的な「日付」を作成（同じ日付だが列として分ける）
  const categoryDates = categories.map((_, index) => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + index * 1000) // 識別用に異なる日付を設定
    return date
  })

  // カテゴリごとにイベントをフィルタリングして、対応する仮想日付に割り当て
  const mappedEvents = events.map((event) => {
    const categoryIndex = categories.indexOf(event.category || '')
    if (categoryIndex === -1) return event

    const mappedDate = categoryDates[categoryIndex]
    return {
      ...event,
      startDate: new Date(
        mappedDate.getFullYear(),
        mappedDate.getMonth(),
        mappedDate.getDate(),
        new Date(event.startDate).getHours(),
        new Date(event.startDate).getMinutes(),
      ),
      endDate: new Date(
        mappedDate.getFullYear(),
        mappedDate.getMonth(),
        mappedDate.getDate(),
        new Date(event.endDate).getHours(),
        new Date(event.endDate).getMinutes(),
      ),
    }
  })

  if (categories.length === 0) {
    const noEventsMessage =
      language === 'ja' ? 'カテゴリが設定されたイベントがありません' : 'No events with categories'
    return (
      <div className="flex items-center justify-center h-[600px] text-muted-foreground">
        {noEventsMessage}
      </div>
    )
  }

  return (
    <div className="h-[600px]">
      {/* カテゴリヘッダー */}
      <div
        className="grid border-b"
        style={{ gridTemplateColumns: `60px repeat(${categories.length}, 1fr)` }}
      >
        <div className="p-2" />
        {categories.map((category) => (
          <div key={category} className="p-2 text-center border-r last:border-r-0 font-semibold">
            {category}
          </div>
        ))}
      </div>

      {/* タイムグリッド */}
      <TimeGrid
        dates={categoryDates}
        events={mappedEvents}
        config={config}
        language={language}
        onEventClick={onEventClick}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        showDayHeaders={false}
      />
    </div>
  )
}
