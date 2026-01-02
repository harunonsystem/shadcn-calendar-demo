import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { TimeGrid } from '../time-grid'
import { EventCategoryChangeModal } from '../event-category-change-modal'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'
import { getUniqueCategories } from '@/lib/utils/event'
import { getTranslation } from '@/lib/i18n'

interface CategoryViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onEventEdit?: (event: CalendarEvent) => void
  // Note: onEventDropはCategoryViewでは使用しない（代わりにカテゴリ変更として処理）
  _onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
  onEventCategoryChange?: (event: CalendarEvent, newCategory: string) => void
}

export function CategoryView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
  onEventClick,
  onEventEdit,
  _onEventDrop,
  onEventResize,
  onEventCategoryChange,
}: CategoryViewProps) {
  // Jotai atomsからデフォルト値を取得、propsがあればそちらを優先
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const atomEvents = useAtomValue(eventsAtom)
  const atomConfig = useAtomValue(configAtom)

  const currentDate = propCurrentDate ?? atomCurrentDate
  const events = propEvents ?? atomEvents
  const config = propConfig ?? atomConfig

  // カテゴリ変更確認モーダルの状態
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [pendingCategoryChange, setPendingCategoryChange] = useState<{
    event: CalendarEvent
    newCategory: string
  } | null>(null)

  // 共通関数でカテゴリ一覧を取得
  const categories = getUniqueCategories(events)

  // カテゴリごとに仮想的な「日付」を作成（同じ日付だが列として分ける）
  const categoryDates = categories.map((_, index) => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + index * 1000) // 識別用に異なる日付を設定
    return date
  })

  // 仮想日付からカテゴリを逆引きする関数
  const getCategoryFromDate = (date: Date): string | null => {
    // categoryDatesの中から一致する日付を探す
    const index = categoryDates.findIndex(
      (categoryDate) => categoryDate.getTime() === date.getTime(),
    )
    if (index >= 0 && index < categories.length) {
      return categories[index]
    }
    return null
  }

  // 元のイベントを取得する関数
  const getOriginalEvent = (mappedEvent: CalendarEvent): CalendarEvent | null => {
    return events.find((e) => e.id === mappedEvent.id) || null
  }

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

  // TimeGridからのドロップをカテゴリ変更として処理
  const handleEventDrop = (event: CalendarEvent, newDate: Date, _newStartTime: number) => {
    const newCategory = getCategoryFromDate(newDate)
    const originalEvent = getOriginalEvent(event)

    if (!newCategory || !originalEvent) return

    // 同じカテゴリへのドロップは無視
    if (originalEvent.category === newCategory) return

    // 確認モーダルを表示
    setPendingCategoryChange({ event: originalEvent, newCategory })
    setShowCategoryModal(true)
  }

  const handleCategoryConfirm = () => {
    if (pendingCategoryChange) {
      onEventCategoryChange?.(pendingCategoryChange.event, pendingCategoryChange.newCategory)
    }
    setShowCategoryModal(false)
    setPendingCategoryChange(null)
  }

  const handleCategoryCancel = () => {
    setShowCategoryModal(false)
    setPendingCategoryChange(null)
  }

  if (categories.length === 0) {
    const t = getTranslation(language)
    return (
      <div className="flex items-center justify-center h-[600px] text-muted-foreground">
        {t.noEventsWithCategory}
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
        onEventEdit={onEventEdit}
        onEventDrop={handleEventDrop}
        onEventResize={onEventResize}
        showDayHeaders={false}
      />

      {/* カテゴリ変更確認モーダル */}
      <EventCategoryChangeModal
        event={pendingCategoryChange?.event || null}
        language={language}
        isOpen={showCategoryModal}
        newCategory={pendingCategoryChange?.newCategory || ''}
        categoryColors={config.categoryColors}
        onConfirm={handleCategoryConfirm}
        onCancel={handleCategoryCancel}
      />
    </div>
  )
}
