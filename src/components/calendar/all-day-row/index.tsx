import { CalendarEvent, Language, CategoryColor } from '@/types/calendar'
import { getTranslation } from '@/lib/i18n'
import { getEventStyle } from '../calendar-utils'
import { useRef } from 'react'
import { isSameDay } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { useAllDayRowInteraction } from '@/lib/hooks/use-all-day-row-interaction'

interface AllDayRowProps {
  dates: Date[]
  events: CalendarEvent[]
  language: Language
  categoryColors?: CategoryColor[]
  onEventClick?: (event: CalendarEvent, position: { x: number; y: number }) => void
  onEventDrop?: (event: CalendarEvent, newDate: Date) => void
}

const MAX_VISIBLE_ALLDAY = 3

export function AllDayRow({
  dates,
  events,
  language,
  categoryColors = [],
  onEventClick,
  onEventDrop,
}: AllDayRowProps) {
  const t = getTranslation(language)
  const allDayEvents = events.filter((e) => e.allDay)
  const rowRef = useRef<HTMLDivElement>(null)

  // カスタムフックでドラッグ操作を管理
  const { state, handlers, actions } = useAllDayRowInteraction({
    dates,
    rowRef,
    onEventDrop,
  })

  const { dragState } = state
  const { handleMouseDown } = handlers
  const { isInteracting } = actions

  if (allDayEvents.length === 0) return null

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    // ドラッグ中・ドラッグ終了直後はクリックを無視
    if (isInteracting()) return

    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    onEventClick?.(event, { x: rect.right + 8, y: rect.top })
  }

  return (
    <div className="grid grid-cols-[60px_1fr] border-b bg-muted/30">
      <div className="p-2 text-xs text-muted-foreground flex items-center justify-end pr-3">
        {t.allDay}
      </div>
      <div
        ref={rowRef}
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
      >
        {dates.map((date, dateIndex) => {
          const dayAllDayEvents = allDayEvents.filter((event) => {
            const eventStart = new Date(event.startDate)
            const eventEnd = new Date(event.endDate)
            return (
              isSameDay(date, eventStart) ||
              isSameDay(date, eventEnd) ||
              (date > eventStart && date < eventEnd)
            )
          })

          const visibleEvents = dayAllDayEvents.slice(0, MAX_VISIBLE_ALLDAY)
          const hiddenCount = dayAllDayEvents.length - MAX_VISIBLE_ALLDAY
          const isDropTarget = dragState.isDragging && dragState.targetColumnIndex === dateIndex

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'min-h-[28px] p-1 border-r last:border-r-0 space-y-1 transition-colors',
                isDropTarget && 'bg-primary/10',
              )}
            >
              {/* ドラッグプレビュー */}
              {isDropTarget &&
                dragState.draggedEvent &&
                !dayAllDayEvents.some((e) => e.id === dragState.draggedEvent?.id) && (
                  <div
                    className="text-xs px-2 py-0.5 rounded truncate opacity-50 border-2 border-dashed"
                    style={{
                      ...getEventStyle(dragState.draggedEvent, { categoryColors }),
                      color: 'white',
                    }}
                  >
                    {dragState.draggedEvent.title}
                  </div>
                )}

              {visibleEvents.map((event) => {
                const isDragging = dragState.isDragging && dragState.draggedEvent?.id === event.id

                return (
                  <div
                    key={event.id}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded truncate cursor-grab hover:opacity-80 transition-opacity',
                      isDragging && 'opacity-50',
                    )}
                    style={{
                      ...getEventStyle(event, { categoryColors }),
                      color: 'white',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, event)}
                    onClick={(e) => handleEventClick(e, event)}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                )
              })}
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
