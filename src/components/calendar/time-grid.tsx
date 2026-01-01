import {
  CalendarEvent,
  CalendarConfig,
  Language,
  EventDragState,
  EventResizeState,
} from '@/types/calendar'
import { isSameDay } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { getEventStyle } from './calendar-utils'
import {
  getTimeGridEventInfo,
  calculateEventPosition,
  groupOverlappingEvents,
  calculateOverlapLayout,
  getNowIndicatorPositionForTimeGrid,
} from '@/lib/utils/time'
import {
  TIME_SLOT_HEIGHT_PX,
  TIME_SLOT_INTERVAL_MINUTES,
  MINUTES_PER_HOUR,
  HOURS_PER_DAY,
} from '@/lib/constants'
import { getTranslation } from '@/lib/i18n'
import { useState, useRef, useCallback, useEffect } from 'react'
import { EventResizeModal } from './event-resize-modal'
import { EventMoveModal } from './event-move-modal'
import { EventPopover } from './event-popover'
import { AllDayRow } from './all-day-row'

interface TimeGridProps {
  dates: Date[]
  events: CalendarEvent[]
  config: CalendarConfig
  language: Language
  onEventClick?: (event: CalendarEvent) => void
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
  onDateClick,
  onTimeSlotClick,
  onEventDrop,
  onEventResize,
  showDayHeaders = true,
}: TimeGridProps) {
  const [dragState, setDragState] = useState<EventDragState>({
    isDragging: false,
    draggedEvent: null,
    dragOffset: { x: 0, y: 0 },
    originalDate: new Date(),
  })

  const [isDragStarted, setIsDragStarted] = useState(false)
  const [_mouseDownTime, setMouseDownTime] = useState(0)
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0, y: 0 })

  const [resizeState, setResizeState] = useState<EventResizeState>({
    isResizing: false,
    resizedEvent: null,
    resizeHandle: null,
    originalHeight: 0,
  })

  const [showResizeModal, setShowResizeModal] = useState(false)
  const [pendingResize, setPendingResize] = useState<{
    event: CalendarEvent
    newStartTime: number
    newEndTime: number
  } | null>(null)

  // ドラッグ確認モーダル用
  const [showDragModal, setShowDragModal] = useState(false)
  const [pendingDrag, setPendingDrag] = useState<{
    event: CalendarEvent
    newDate: Date
    newStartMinutes: number
  } | null>(null)

  // ドラッグプレビュー用
  const [dragPreview, setDragPreview] = useState<{
    columnIndex: number
    startMinutes: number
    height: number
  } | null>(null)

  // Now Indicator
  const [nowIndicatorPos, setNowIndicatorPos] = useState(getNowIndicatorPositionForTimeGrid())

  // Now Indicatorの更新（毎分）
  useEffect(() => {
    if (!config.showNowIndicator) return

    const updateNowIndicator = () => {
      setNowIndicatorPos(getNowIndicatorPositionForTimeGrid())
    }

    // 毎分更新
    const interval = setInterval(updateNowIndicator, 60000)
    return () => clearInterval(interval)
  }, [config.showNowIndicator])

  // イベントポップオーバー用
  const [popoverState, setPopoverState] = useState<{
    isOpen: boolean
    event: CalendarEvent | null
    position: { x: number; y: number }
  }>({
    isOpen: false,
    event: null,
    position: { x: 0, y: 0 },
  })

  const gridRef = useRef<HTMLDivElement>(null)

  // ドラッグ開始
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, event: CalendarEvent, handle?: 'top' | 'bottom') => {
      e.preventDefault()
      e.stopPropagation()

      // ドラッグ/リサイズ開始時にpopoverを閉じる
      setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })

      // マウスダウンの時間と位置を記録
      setMouseDownTime(Date.now())
      setMouseDownPosition({ x: e.clientX, y: e.clientY })
      setIsDragStarted(false)

      if (handle) {
        // リサイズ開始
        const position = calculateEventPosition(event)
        setResizeState({
          isResizing: true,
          resizedEvent: event,
          resizeHandle: handle,
          originalHeight: position.height,
        })
      } else {
        // ドラッグ準備（まだ実際のドラッグではない）
        const rect = e.currentTarget.getBoundingClientRect()
        setDragState({
          isDragging: false, // まだドラッグ状態ではない
          draggedEvent: event,
          dragOffset: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
          originalDate: new Date(event.startDate),
        })
      }
    },
    [],
  )

  // マウス移動
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // ドラッグ状態でない場合、移動距離をチェックしてドラッグ開始を判定
      if (dragState.draggedEvent && !dragState.isDragging && !isDragStarted) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - mouseDownPosition.x, 2) +
            Math.pow(e.clientY - mouseDownPosition.y, 2),
        )

        // 5px以上移動したらドラッグ開始
        if (distance > 5) {
          setDragState((prev) => ({ ...prev, isDragging: true }))
          setIsDragStarted(true)
        }
      }

      if (dragState.isDragging && dragState.draggedEvent && gridRef.current) {
        // ドラッグ中の処理 - プレビュー表示
        const gridRect = gridRef.current.getBoundingClientRect()
        const columnWidth = gridRect.width / dates.length
        const columnIndex = Math.floor((e.clientX - gridRect.left) / columnWidth)
        const clampedColumnIndex = Math.max(0, Math.min(columnIndex, dates.length - 1))

        // Y位置から新しい開始時間を計算
        const yPosition = e.clientY - gridRect.top
        const rawMinutes = (yPosition / TIME_SLOT_HEIGHT_PX) * TIME_SLOT_INTERVAL_MINUTES
        const snappedMinutes = Math.max(
          0,
          Math.min(
            Math.round(rawMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_INTERVAL_MINUTES,
            HOURS_PER_DAY * MINUTES_PER_HOUR - TIME_SLOT_INTERVAL_MINUTES,
          ),
        )

        // イベントの高さ（継続時間）を取得
        const eventDuration =
          (new Date(dragState.draggedEvent.endDate).getTime() -
            new Date(dragState.draggedEvent.startDate).getTime()) /
          (1000 * 60)
        const previewHeight = (eventDuration / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX

        // プレビューを更新
        setDragPreview({
          columnIndex: clampedColumnIndex,
          startMinutes: snappedMinutes,
          height: previewHeight,
        })

        // ドラッグ状態を更新
        setDragState((prev) => ({
          ...prev,
          dragOffset: {
            x: e.clientX - gridRect.left,
            y: e.clientY - gridRect.top,
          },
        }))
      }

      if (resizeState.isResizing && gridRef.current) {
        // リサイズ中の処理 - プレビュー表示
        // 視覚的なフィードバックは CSS で処理し、実際の時間計算は mouseUp 時に行う
      }
    },
    [
      dragState.isDragging,
      dragState.draggedEvent,
      isDragStarted,
      mouseDownPosition,
      resizeState.isResizing,
      resizeState.resizedEvent,
      resizeState.resizeHandle,
      dates,
    ],
  )

  // マウスリリース
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (dragState.isDragging && dragState.draggedEvent && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect()
        const columnWidth = gridRect.width / dates.length
        const columnIndex = Math.floor((e.clientX - gridRect.left) / columnWidth)
        const newDate = dates[Math.max(0, Math.min(columnIndex, dates.length - 1))]

        // Y位置から新しい開始時間を計算
        const yPosition = e.clientY - gridRect.top
        const rawMinutes = (yPosition / TIME_SLOT_HEIGHT_PX) * TIME_SLOT_INTERVAL_MINUTES
        const newStartMinutes = Math.max(
          0,
          Math.min(
            Math.round(rawMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_INTERVAL_MINUTES,
            HOURS_PER_DAY * MINUTES_PER_HOUR - TIME_SLOT_INTERVAL_MINUTES,
          ),
        )

        if (onEventDrop && newDate) {
          // 元の位置と比較して変更があるかチェック
          const originalStart = new Date(dragState.draggedEvent.startDate)
          const originalStartMinutes = originalStart.getHours() * 60 + originalStart.getMinutes()
          const isSamePosition =
            isSameDay(originalStart, newDate) && originalStartMinutes === newStartMinutes

          // 位置が変わっていない場合は何もしない
          if (isSamePosition) {
            // スキップ - 元の位置に戻った
          } else if (config.quickDragDrop !== false) {
            // 即座に移動
            onEventDrop(dragState.draggedEvent, newDate, newStartMinutes)
          } else {
            // モーダルで確認
            setPendingDrag({
              event: dragState.draggedEvent,
              newDate,
              newStartMinutes,
            })
            setShowDragModal(true)
          }
        }
      }

      if (resizeState.isResizing && resizeState.resizedEvent && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect()
        const yPosition = Math.max(0, e.clientY - gridRect.top)
        const rawMinutes = (yPosition / TIME_SLOT_HEIGHT_PX) * TIME_SLOT_INTERVAL_MINUTES
        const newTimeMinutes =
          Math.round(rawMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_INTERVAL_MINUTES

        const startMinutes =
          new Date(resizeState.resizedEvent.startDate).getHours() * 60 +
          new Date(resizeState.resizedEvent.startDate).getMinutes()
        const endMinutes =
          new Date(resizeState.resizedEvent.endDate).getHours() * 60 +
          new Date(resizeState.resizedEvent.endDate).getMinutes()

        let newStartTime = startMinutes
        let newEndTime = endMinutes

        if (resizeState.resizeHandle === 'top') {
          // 上端をドラッグ: 開始時間を変更、終了時間は固定
          newStartTime = Math.min(newTimeMinutes, endMinutes - 30)
          newStartTime = Math.max(0, newStartTime) // 0時より前にはできない
        } else if (resizeState.resizeHandle === 'bottom') {
          // 下端をドラッグ: 終了時間を変更、開始時間は固定
          newEndTime = Math.max(newTimeMinutes, startMinutes + TIME_SLOT_INTERVAL_MINUTES)
          newEndTime = Math.min(HOURS_PER_DAY * MINUTES_PER_HOUR, newEndTime)
        }

        if (newStartTime !== startMinutes || newEndTime !== endMinutes) {
          if (config.quickResize) {
            // 即座に変更
            onEventResize?.(resizeState.resizedEvent, newStartTime, newEndTime)
          } else {
            // モーダルで確認
            setPendingResize({
              event: resizeState.resizedEvent,
              newStartTime,
              newEndTime,
            })
            setShowResizeModal(true)
          }
        }
      }

      setDragState({
        isDragging: false,
        draggedEvent: null,
        dragOffset: { x: 0, y: 0 },
        originalDate: new Date(),
      })

      setResizeState({
        isResizing: false,
        resizedEvent: null,
        resizeHandle: null,
        originalHeight: 0,
      })

      // ドラッグ関連の状態をリセット
      setIsDragStarted(false)
      setMouseDownTime(0)
      setMouseDownPosition({ x: 0, y: 0 })
      setDragPreview(null)
    },
    [dragState, resizeState, dates, onEventDrop, onEventResize, config.quickResize],
  )

  // モーダルハンドラー
  const handleResizeConfirm = useCallback(() => {
    if (pendingResize && onEventResize) {
      onEventResize(pendingResize.event, pendingResize.newStartTime, pendingResize.newEndTime)
    }
    setShowResizeModal(false)
    setPendingResize(null)
  }, [pendingResize, onEventResize])

  const handleResizeCancel = useCallback(() => {
    setShowResizeModal(false)
    setPendingResize(null)
  }, [])

  // ドラッグ確認モーダルハンドラー
  const handleDragConfirm = useCallback(() => {
    if (pendingDrag && onEventDrop) {
      onEventDrop(pendingDrag.event, pendingDrag.newDate, pendingDrag.newStartMinutes)
    }
    setShowDragModal(false)
    setPendingDrag(null)
  }, [pendingDrag, onEventDrop])

  const handleDragCancel = useCallback(() => {
    setShowDragModal(false)
    setPendingDrag(null)
  }, [])

  // グローバルマウスイベントリスナー
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging || resizeState.isResizing) {
        // React MouseEventと同じ形式に変換
        const syntheticEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          stopPropagation: () => e.stopPropagation(),
          preventDefault: () => e.preventDefault(),
        } as React.MouseEvent

        handleMouseMove(syntheticEvent)
      }
    }

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (dragState.isDragging || resizeState.isResizing) {
        const syntheticEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          stopPropagation: () => e.stopPropagation(),
          preventDefault: () => e.preventDefault(),
        } as React.MouseEvent

        handleMouseUp(syntheticEvent)
      }
    }

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.body.style.cursor = dragState.isDragging
        ? 'grabbing'
        : resizeState.resizeHandle === 'top'
          ? 'n-resize'
          : resizeState.resizeHandle === 'bottom'
            ? 's-resize'
            : 'default'
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.body.style.cursor = 'default'
    }
  }, [
    dragState.isDragging,
    resizeState.isResizing,
    handleMouseMove,
    handleMouseUp,
    resizeState.resizeHandle,
  ])

  // 24時間全体を表示
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const timeSlots = hours.flatMap((hour) => [
    { hour, minute: 0, label: `${hour}`, isMainHour: true },
    { hour, minute: 30, label: '', isMainHour: false },
  ])

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

      {/* All-day events row (Google Calendar style) */}
      <AllDayRow dates={dates} events={events} language={language} onEventClick={onEventClick} />

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="grid grid-cols-[60px_1fr]"
          style={{ minHeight: `${timeSlots.length * 24}px` }}
        >
          {/* Time labels */}
          <div className="border-r bg-gray-50/50">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className={cn(
                  'h-6 text-xs text-right pr-3 relative',
                  slot.isMainHour ? 'text-gray-600 font-medium' : '',
                )}
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {dates.map((date, dateIndex) => (
              <div key={date.toISOString()} className="border-r last:border-r-0 relative">
                {/* Time slots - 各スロット24px高さ */}
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
                {dragPreview && dragPreview.columnIndex === dateIndex && dragState.draggedEvent && (
                  <div
                    className="absolute left-1 right-1 rounded pointer-events-none opacity-50 border-2 border-dashed"
                    style={{
                      top:
                        (dragPreview.startMinutes / TIME_SLOT_INTERVAL_MINUTES) *
                        TIME_SLOT_HEIGHT_PX,
                      height: dragPreview.height,
                      backgroundColor: dragState.draggedEvent.backgroundColor || '#3b82f6',
                      borderColor: dragState.draggedEvent.borderColor || '#1d4ed8',
                    }}
                  />
                )}

                {/* Now Indicator - 今日の列にのみ表示 */}
                {config.showNowIndicator && isSameDay(date, new Date()) && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
                    style={{ top: nowIndicatorPos }}
                  >
                    {/* 丸い点 */}
                    <div
                      className="w-2.5 h-2.5 rounded-full -ml-1"
                      style={{ backgroundColor: config.nowIndicatorColor || '#ef4444' }}
                    />
                    {/* 線 */}
                    <div
                      className="flex-1 h-0.5"
                      style={{ backgroundColor: config.nowIndicatorColor || '#ef4444' }}
                    />
                  </div>
                )}

                {/* Events */}
                {(() => {
                  const dayEvents = events.filter(
                    (event) => !event.allDay && isSameDay(new Date(event.startDate), date),
                  )
                  const eventGroups = groupOverlappingEvents(dayEvents)

                  return eventGroups.flatMap((group) => {
                    const layouts = calculateOverlapLayout(group, config.eventStackMode)

                    return layouts.map(({ event, width, left, zIndex }) => {
                      const { position, displayInfo, timeRange } = getTimeGridEventInfo(event)
                      const isDragging =
                        dragState.isDragging && dragState.draggedEvent?.id === event.id
                      const isResizing =
                        resizeState.isResizing && resizeState.resizedEvent?.id === event.id

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            'absolute px-1 py-0.5 text-xs rounded cursor-move group transition-all hover:z-50 hover:shadow-lg',
                            isDragging && 'opacity-50 shadow-lg border-2 border-blue-500',
                            isResizing && 'opacity-70 shadow-md z-50',
                          )}
                          style={{
                            top: position.top,
                            height: position.height,
                            left: `${left}%`,
                            width: `${width}%`,
                            zIndex: isDragging || isResizing ? 50 : zIndex + 10,
                            ...getEventStyle(event),
                          }}
                          onMouseDown={(e) => handleMouseDown(e, event)}
                          onClick={(e) => {
                            e.stopPropagation()

                            // ドラッグが発生していない場合のみクリックとして処理
                            if (
                              !dragState.isDragging &&
                              !resizeState.isResizing &&
                              !isDragStarted
                            ) {
                              // ポップオーバーを表示
                              const rect = e.currentTarget.getBoundingClientRect()
                              setPopoverState({
                                isOpen: true,
                                event,
                                position: {
                                  x: rect.right + 8,
                                  y: rect.top,
                                },
                              })
                            }
                          }}
                        >
                          {/* Top resize handle */}
                          {config.enableResize && position.height >= 30 && (
                            <div
                              className="absolute -top-1 left-0 right-0 h-3 cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity"
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                handleMouseDown(e, event, 'top')
                              }}
                            />
                          )}

                          {displayInfo.showTitle && (
                            <div className="font-semibold text-white truncate">{event.title}</div>
                          )}
                          {displayInfo.showTime && (
                            <div className="text-white/90 text-xs truncate">{timeRange}</div>
                          )}
                          {displayInfo.showDescription && event.description && (
                            <div className="text-white/80 text-xs truncate">
                              {event.description}
                            </div>
                          )}

                          {/* Bottom resize handle */}
                          {config.enableResize && position.height >= 30 && (
                            <div
                              className="absolute -bottom-1 left-0 right-0 h-3 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                handleMouseDown(e, event, 'bottom')
                              }}
                            />
                          )}
                        </div>
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
        event={pendingResize?.event || null}
        language={language}
        isOpen={showResizeModal}
        newStartTime={pendingResize?.newStartTime || 0}
        newEndTime={pendingResize?.newEndTime || 0}
        onConfirm={handleResizeConfirm}
        onCancel={handleResizeCancel}
      />

      {/* Drag confirmation modal */}
      <EventMoveModal
        event={pendingDrag?.event || null}
        language={language}
        isOpen={showDragModal}
        newDate={pendingDrag?.newDate || null}
        newStartMinutes={pendingDrag?.newStartMinutes || 0}
        onConfirm={handleDragConfirm}
        onCancel={handleDragCancel}
      />

      {/* Event popover */}
      <EventPopover
        event={popoverState.event}
        language={language}
        isOpen={popoverState.isOpen}
        position={popoverState.position}
        onClose={() => setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })}
        onEdit={(event) => {
          setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })
          onEventClick?.(event)
        }}
        onDelete={(_event) => {
          setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })
          // TODO: 削除処理を呼び出し
        }}
        onOpenDetail={(event) => {
          setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })
          onEventClick?.(event)
        }}
      />
    </div>
  )
}
