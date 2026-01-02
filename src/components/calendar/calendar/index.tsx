import { useEffect, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { Card, CardContent } from '@/components/ui/card'
import { ViewMode, CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { CalendarHeader } from '../calendar-header'
import { MonthView } from '../month-view'
import { WeekView } from '../week-view'
import { DayView } from '../day-view'
import { CategoryView } from '../category-view'
import { EventDetailModal } from '../event-detail-modal'
import {
  currentDateAtom,
  eventsAtom,
  configAtom,
  selectedEventAtom,
  isEventDetailOpenAtom,
} from '@/lib/atoms'

interface CalendarProps {
  events?: CalendarEvent[]
  config?: CalendarConfig
  onEventClick?: (event: CalendarEvent) => void
  onEventUpdate?: (event: CalendarEvent) => void
  onEventDelete?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
  onEventCategoryChange?: (event: CalendarEvent, newCategory: string) => void
}

// nuqs parsers for URL state
const viewModeParser = parseAsStringLiteral(['month', 'week', 'day', 'category'] as const)
const languageParser = parseAsStringLiteral(['ja', 'en'] as const)

export function Calendar({
  events: propEvents = [],
  config: propConfig = {},
  onEventClick,
  onEventUpdate,
  onEventDelete,
  onDateClick,
  onCreateEvent,
  onEventDrop,
  onEventResize,
  onEventCategoryChange,
}: CalendarProps) {
  // Jotai atoms
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const setEvents = useSetAtom(eventsAtom)
  const setConfig = useSetAtom(configAtom)
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom)
  const [showEventDetail, setShowEventDetail] = useAtom(isEventDetailOpenAtom)

  // 編集モードで開くかどうか
  const [openInEditMode, setOpenInEditMode] = useState(false)

  // nuqs for URL state synchronization
  const [viewMode, setViewMode] = useQueryState(
    'type',
    viewModeParser.withDefault(propConfig.defaultView || 'month'),
  )
  const [language, setLanguage] = useQueryState(
    'lang',
    languageParser.withDefault(propConfig.language || 'ja'),
  )

  // Sync props to atoms
  useEffect(() => {
    setEvents(propEvents)
  }, [propEvents, setEvents])

  useEffect(() => {
    setConfig({
      showNowIndicator: true,
      nowIndicatorColor: '#ef4444',
      language: 'ja',
      defaultView: 'month',
      enableDragDrop: true,
      enableResize: true,
      eventStackMode: 'stack',
      quickResize: false,
      quickDragDrop: false,
      firstDayOfWeek: 0,
      ...propConfig,
    })
  }, [propConfig, setConfig])

  const navigate = (direction: 'prev' | 'next') => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
    } else if (viewMode === 'week') {
      const days = direction === 'next' ? 7 : -7
      setCurrentDate(new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000))
    } else if (viewMode === 'day' || viewMode === 'category') {
      const days = direction === 'next' ? 1 : -1
      setCurrentDate(new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000))
    }
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    setViewMode('day')
    onDateClick?.(date)
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  // 詳細表示（閲覧モード）
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setOpenInEditMode(false)
    setShowEventDetail(true)
    onEventClick?.(event)
  }

  // 編集ボタンからの開始（編集モード）
  const handleEventEditClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setOpenInEditMode(true)
    setShowEventDetail(true)
  }

  const handleEventSave = (event: CalendarEvent) => {
    setShowEventDetail(false)
    setOpenInEditMode(false)
    onEventUpdate?.(event)
  }

  const handleEventDelete = (event: CalendarEvent) => {
    setShowEventDetail(false)
    setOpenInEditMode(false)
    onEventDelete?.(event)
  }

  const handleModalClose = () => {
    setShowEventDetail(false)
    setOpenInEditMode(false)
  }

  // Get config with effective language
  const effectiveConfig: CalendarConfig = {
    ...propConfig,
    language: language as Language,
  }

  const renderCurrentView = () => {
    const commonProps = {
      currentDate,
      events: propEvents,
      config: effectiveConfig,
      language: language as Language,
      onEventClick: handleEventClick,
      onEventEdit: handleEventEditClick,
      onEventDrop,
      onEventResize,
    }

    switch (viewMode) {
      case 'month':
        return <MonthView {...commonProps} onDateClick={handleDateClick} />
      case 'week':
        return <WeekView {...commonProps} onDateClick={handleDateClick} />
      case 'day':
        return <DayView {...commonProps} />
      case 'category':
        return <CategoryView {...commonProps} onEventCategoryChange={onEventCategoryChange} />
      default:
        return <MonthView {...commonProps} onDateClick={handleDateClick} />
    }
  }

  return (
    <Card className="w-full">
      <CalendarHeader
        viewMode={viewMode as ViewMode}
        language={language as Language}
        currentDate={currentDate}
        onViewModeChange={(mode) => setViewMode(mode)}
        onLanguageChange={(lang) => setLanguage(lang)}
        onNavigate={navigate}
        onTodayClick={handleTodayClick}
        onCreateEvent={onCreateEvent}
      />
      <CardContent>{renderCurrentView()}</CardContent>

      <EventDetailModal
        event={selectedEvent}
        language={language as Language}
        isOpen={showEventDetail}
        categories={
          propConfig.categoryColors?.map((c) => ({
            category: c.label,
            label: c.label,
            backgroundColor: c.backgroundColor,
            borderColor: c.borderColor,
          })) || []
        }
        initialEditMode={openInEditMode}
        onClose={handleModalClose}
        onDelete={handleEventDelete}
        onUpdate={handleEventSave}
      />
    </Card>
  )
}
