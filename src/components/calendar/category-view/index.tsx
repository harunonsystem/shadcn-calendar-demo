import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { TimeGrid } from '../time-grid'
import { EventCategoryChangeModal } from '../event-category-change-modal'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'
import { getUniqueCategories } from '@/lib/utils/event'

interface CategoryViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onEventEdit?: (event: CalendarEvent) => void
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

  // 全イベントからカテゴリ一覧を取得（当日に限らず全カテゴリを表示）
  const categories = getUniqueCategories(events)

  // カテゴリがない場合は何も表示しない
  if (categories.length === 0) {
    return <div className="h-[600px]" />
  }

  // 当日のイベントのみをフィルタリング
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate)
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate()
    )
  })

  // カテゴリごとに仮想的な「日付」を作成（TimeGridの列として使用）
  const categoryDates = categories.map((_, index) => {
    const date = new Date(currentDate)
    date.setFullYear(2000 + index) // 識別用に異なる年を設定
    return date
  })

  // カテゴリ名をヘッダーに表示するためのマッピング
  const categoryHeaders = categories.reduce(
    (acc, category, index) => {
      const date = categoryDates[index]
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      acc[key] = category
      return acc
    },
    {} as Record<string, string>,
  )

  // 仮想日付からカテゴリを逆引きする関数
  const getCategoryFromDate = (date: Date): string | null => {
    const index = categoryDates.findIndex(
      (categoryDate) => categoryDate.getFullYear() === date.getFullYear(),
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

  // 当日のイベントをカテゴリごとの仮想日付にマッピング
  const mappedEvents = todayEvents.map((event) => {
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

  // カスタムヘッダーフォーマット関数（日付→カテゴリ名）
  const formatCategoryHeader = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    return categoryHeaders[key] || ''
  }

  return (
    <div className="h-[600px]">
      <TimeGrid
        dates={categoryDates}
        events={mappedEvents}
        config={config}
        language={language}
        onEventClick={onEventClick}
        onEventEdit={onEventEdit}
        onEventDrop={handleEventDrop}
        onEventResize={onEventResize}
        showDayHeaders={true}
        customHeaderFormat={formatCategoryHeader}
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
