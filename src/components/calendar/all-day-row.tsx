import { CalendarEvent, Language } from '@/types/calendar'
import { getTranslation } from '@/lib/i18n'

interface AllDayRowProps {
  dates: Date[]
  events: CalendarEvent[]
  language: Language
  onEventClick?: (event: CalendarEvent) => void
}

const MAX_VISIBLE_ALLDAY = 3

export function AllDayRow({ dates, events, language, onEventClick }: AllDayRowProps) {
  const t = getTranslation(language)
  const allDayEvents = events.filter((e) => e.allDay)

  if (allDayEvents.length === 0) return null

  return (
    <div className="grid grid-cols-[60px_1fr] border-b bg-muted/30">
      <div className="p-2 text-xs text-muted-foreground flex items-center justify-end pr-3">
        {t.allDay}
      </div>
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}>
        {dates.map((date) => {
          const dayAllDayEvents = allDayEvents.filter((event) => {
            const eventStart = new Date(event.startDate)
            const eventEnd = new Date(event.endDate)
            const dateStart = new Date(date)
            dateStart.setHours(0, 0, 0, 0)
            const eventStartNormalized = new Date(eventStart)
            eventStartNormalized.setHours(0, 0, 0, 0)
            const eventEndNormalized = new Date(eventEnd)
            eventEndNormalized.setHours(23, 59, 59, 999)
            return dateStart >= eventStartNormalized && dateStart <= eventEndNormalized
          })

          const visibleEvents = dayAllDayEvents.slice(0, MAX_VISIBLE_ALLDAY)
          const hiddenCount = dayAllDayEvents.length - MAX_VISIBLE_ALLDAY

          return (
            <div
              key={date.toISOString()}
              className="min-h-[28px] p-1 border-r last:border-r-0 space-y-1"
            >
              {visibleEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs px-2 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: event.backgroundColor || '#3b82f6',
                    color: 'white',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick?.(event)
                  }}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {hiddenCount > 0 && (
                <div className="text-xs text-muted-foreground px-2 cursor-pointer hover:text-foreground">
                  +{hiddenCount} {t.more}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
