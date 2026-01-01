import { CalendarEvent, CalendarConfig, Language } from '@/types/calendar'
import { isSameDay } from '@/lib/utils/date'
import {
  groupOverlappingEvents,
  calculateOverlapLayout,
  getNowIndicatorPositionForTimeGrid,
} from '@/lib/utils/time'
import { generateTimeSlots } from '@/lib/utils/time-slots'
import { TIME_SLOT_HEIGHT_PX, TIME_SLOT_INTERVAL_MINUTES } from '@/lib/constants'
import { getTranslation } from '@/lib/i18n'
import { useState, useRef, useEffect } from 'react'
import { useTimeGridInteraction } from '@/lib/hooks/use-time-grid-interaction'
import { EventResizeModal } from './event-resize-modal'
import { EventMoveModal } from './event-move-modal'
import { EventPopover } from './event-popover'
import { AllDayRow } from './all-day-row'
import { NowIndicator } from './now-indicator'
import { TimeGridEvent } from './time-grid-event'

interface TimeGridProps {
  dates: Date[]
  events: CalendarEvent[]
  config: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
  onEventEdit?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onTimeSlotClick?: (date: Date, hour: number, minute: number) => void
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartTime: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
  showDayHeaders?: boolean
}

export function TimeGrid({
  dates,
  events,
  config,
  language,
  onEventClick,
  onEventEdit,
  onDateClick,
  onTimeSlotClick,
  onEventDrop,
  onEventResize,
  showDayHeaders = true,
}: TimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  // カスタムフックでドラッグ/リサイズ/ポップオーバーを管理
  const { state, handlers, modalHandlers, actions } = useTimeGridInteraction({
    dates,
    config,
    gridRef,
    onEventDrop,
    onEventResize,
  })

  // Now Indicator
  const [nowIndicatorPos, setNowIndicatorPos] = useState(getNowIndicatorPositionForTimeGrid())

  useEffect(() => {
    if (!config.showNowIndicator) return

    const updateNowIndicator = () => {
      setNowIndicatorPos(getNowIndicatorPositionForTimeGrid())
    }

    const interval = setInterval(updateNowIndicator, 60000)
    return () => clearInterval(interval)
  }, [config.showNowIndicator])

  // タイムスロット生成
  const timeSlots = generateTimeSlots()

  const t = getTranslation(language)
  const weekDays = t.weekDays

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      {showDayHeaders && (
        <div className="grid grid-cols-[60px_1fr] border-b">
          <div className="p-2"></div>
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
          >
            {dates.map((date) => (
              <div
                key={date.toISOString()}
                className="p-2 text-center border-r last:border-r-0 cursor-pointer hover:bg-accent"
                onClick={() => onDateClick?.(date)}
              >
                <div className="text-sm font-semibold">
                  {weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                </div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All-day events row */}
      <AllDayRow
        dates={dates}
        events={events}
        language={language}
        onEventClick={(event, position) => {
          actions.openPopover(event, position)
        }}
        onEventDrop={(event, newDate) => {
          // 終日イベントの移動: 開始時刻を0:00として渡す
          onEventDrop?.(event, newDate, 0)
        }}
      />

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[60px_1fr] min-h-full">
          {/* Time labels */}
          <div className="relative">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className="relative h-6 text-xs text-right pr-2"
              >
                {slot.isMainHour && (
                  <>
                    <span className="absolute top-0 right-3 z-10 bg-background px-1 -translate-y-1/2">
                      {slot.label}
                    </span>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />
                  </>
                )}
                {!slot.isMainHour && (
                  <div className="absolute top-0 left-8 right-0 h-px bg-gray-100" />
                )}
              </div>
            ))}
          </div>

          {/* Event grid */}
          <div
            ref={gridRef}
            className="grid gap-0 relative"
            style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
            onMouseMove={handlers.handleMouseMove}
            onMouseUp={handlers.handleMouseUp}
            onMouseLeave={handlers.handleMouseUp}
          >
            {dates.map((date, dateIndex) => (
              <div key={date.toISOString()} className="border-r last:border-r-0 relative">
                {/* Time slots */}
                {timeSlots.map((slot) => (
                  <div
                    key={`${slot.hour}-${slot.minute}`}
                    className="relative h-6 hover:bg-gray-100/50 cursor-pointer"
                    onClick={() => onTimeSlotClick?.(date, slot.hour, slot.minute)}
                  >
                    {slot.isMainHour && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />
                    )}
                    {!slot.isMainHour && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />
                    )}
                  </div>
                ))}

                {/* Drag Preview */}
                {state.dragPreview &&
                  state.dragPreview.columnIndex === dateIndex &&
                  state.dragState.draggedEvent && (
                    <div
                      className="absolute left-1 right-1 rounded pointer-events-none opacity-50 border-2 border-dashed"
                      style={{
                        top:
                          (state.dragPreview.startMinutes / TIME_SLOT_INTERVAL_MINUTES) *
                          TIME_SLOT_HEIGHT_PX,
                        height: state.dragPreview.height,
                        backgroundColor: state.dragState.draggedEvent.backgroundColor || '#3b82f6',
                        borderColor: state.dragState.draggedEvent.borderColor || '#1d4ed8',
                      }}
                    />
                  )}

                {/* Now Indicator */}
                <NowIndicator date={date} position={nowIndicatorPos} config={config} />

                {/* Events */}
                {(() => {
                  const dayEvents = events.filter(
                    (event) => !event.allDay && isSameDay(new Date(event.startDate), date),
                  )
                  const eventGroups = groupOverlappingEvents(dayEvents)

                  return eventGroups.flatMap((group) => {
                    const layouts = calculateOverlapLayout(group, config.eventStackMode)

                    return layouts.map(({ event, width, left, zIndex }) => {
                      const isDragging =
                        state.dragState.isDragging && state.dragState.draggedEvent?.id === event.id
                      const isResizing =
                        state.resizeState.isResizing &&
                        state.resizeState.resizedEvent?.id === event.id

                      return (
                        <TimeGridEvent
                          key={event.id}
                          event={event}
                          config={config}
                          width={width}
                          left={left}
                          zIndex={zIndex}
                          isDragging={isDragging}
                          isResizing={isResizing}
                          isDragStarted={state.isDragStarted}
                          resizePreview={
                            isResizing && state.resizePreview?.eventId === event.id
                              ? { top: state.resizePreview.top, height: state.resizePreview.height }
                              : null
                          }
                          onMouseDown={handlers.handleMouseDown}
                          onClick={(e, clickedEvent) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            actions.openPopover(clickedEvent, {
                              x: rect.right + 8,
                              y: rect.top,
                            })
                          }}
                        />
                      )
                    })
                  })
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resize confirmation modal */}
      <EventResizeModal
        event={state.pendingResize?.event || null}
        language={language}
        isOpen={state.showResizeModal}
        newStartTime={state.pendingResize?.newStartTime || 0}
        newEndTime={state.pendingResize?.newEndTime || 0}
        onConfirm={modalHandlers.handleResizeConfirm}
        onCancel={modalHandlers.handleResizeCancel}
      />

      {/* Drag confirmation modal */}
      <EventMoveModal
        event={state.pendingDrag?.event || null}
        language={language}
        isOpen={state.showDragModal}
        newDate={state.pendingDrag?.newDate || null}
        newStartMinutes={state.pendingDrag?.newStartMinutes || 0}
        onConfirm={modalHandlers.handleDragConfirm}
        onCancel={modalHandlers.handleDragCancel}
      />

      {/* Event popover */}
      <EventPopover
        event={state.popoverState.event}
        language={language}
        isOpen={state.popoverState.isOpen}
        position={state.popoverState.position}
        onClose={actions.closePopover}
        onEdit={(event) => {
          actions.closePopover()
          onEventEdit?.(event)
        }}
        onDelete={(_event) => {
          actions.closePopover()
          // TODO: 削除処理を呼び出し
        }}
        onOpenDetail={(event) => {
          actions.closePopover()
          onEventClick?.(event)
        }}
      />
    </div>
  )
}
