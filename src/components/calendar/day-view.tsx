import { useAtomValue } from 'jotai'
import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { TimeGrid } from './time-grid'
import { currentDateAtom, eventsAtom, configAtom } from '@/lib/atoms'

interface DayViewProps {
  currentDate?: Date
  events?: CalendarEvent[]
  config?: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onEventEdit?: (event: CalendarEvent) => void
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
}

export function DayView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
  onEventClick,
  onEventEdit,
  onEventDrop,
  onEventResize,
}: DayViewProps) {
  // Jotai atomsからデフォルト値を取得、propsがあればそちらを優先
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const atomEvents = useAtomValue(eventsAtom)
  const atomConfig = useAtomValue(configAtom)

  const currentDate = propCurrentDate ?? atomCurrentDate
  const events = propEvents ?? atomEvents
  const config = propConfig ?? atomConfig

  const handleTimeSlotClick = (date: Date, hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    console.log('Time slot clicked:', date.toLocaleDateString(), timeString)
  }

  return (
    <div className="h-[600px]">
      <TimeGrid
        dates={[currentDate]}
        events={events}
        config={config}
        language={language}
        onEventClick={onEventClick}
        onEventEdit={onEventEdit}
        onTimeSlotClick={handleTimeSlotClick}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        showDayHeaders={false}
      />
    </div>
  )
}
