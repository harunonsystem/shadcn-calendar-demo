import { useAtomValue } from 'jotai'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { getWeekDays } from '@/lib/utils/date'
import { TimeGrid } from './time-grid'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'

interface WeekViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
}

export function WeekView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
  onEventClick,
  onDateClick,
  onEventDrop,
  onEventResize,
}: WeekViewProps) {
  // Jotai atomsからデフォルト値を取得、propsがあればそちらを優先
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const atomEvents = useAtomValue(eventsAtom)
  const atomConfig = useAtomValue(configAtom)

  const currentDate = propCurrentDate ?? atomCurrentDate
  const events = propEvents ?? atomEvents
  const config = propConfig ?? atomConfig

  // firstDayOfWeekを考慮して週の日付を取得
  const weekDays = getWeekDays(currentDate, config.firstDayOfWeek ?? 0)

  const handleTimeSlotClick = (date: Date, hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    console.log('Time slot clicked:', date.toLocaleDateString(), timeString)
  }

  return (
    <div className="h-[600px]">
      <TimeGrid
        dates={weekDays}
        events={events}
        config={config}
        language={language}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        onTimeSlotClick={handleTimeSlotClick}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        showDayHeaders={true}
      />
    </div>
  )
}
