import { useState, useCallback, useRef, useEffect } from 'react'
import { CalendarEvent, CalendarConfig, EventDragState, EventResizeState } from '@/types/calendar'
import { calculateEventPosition } from '@/lib/utils/time'
import {
  TIME_SLOT_HEIGHT_PX,
  TIME_SLOT_INTERVAL_MINUTES,
  MINUTES_PER_HOUR,
  HOURS_PER_DAY,
} from '@/lib/constants'
import { isSameDay } from '@/lib/utils/date'

export interface PopoverState {
  isOpen: boolean
  event: CalendarEvent | null
  position: { x: number; y: number }
}

export interface DragPreview {
  columnIndex: number
  startMinutes: number
  height: number
}

export interface ResizePreview {
  eventId: string
  top: number
  height: number
}

export interface PendingDrag {
  event: CalendarEvent
  newDate: Date
  newStartMinutes: number
}

export interface PendingResize {
  event: CalendarEvent
  newStartTime: number
  newEndTime: number
}

interface UseTimeGridInteractionOptions {
  dates: Date[]
  config: CalendarConfig
  gridRef: React.RefObject<HTMLDivElement | null>
  onEventDrop?: (event: CalendarEvent, newDate: Date, newStartMinutes: number) => void
  onEventResize?: (event: CalendarEvent, newStartTime: number, newEndTime: number) => void
}

export function useTimeGridInteraction({
  dates,
  config,
  gridRef,
  onEventDrop,
  onEventResize,
}: UseTimeGridInteractionOptions) {
  // 状態管理
  const [dragState, setDragState] = useState<EventDragState>({
    isDragging: false,
    draggedEvent: null,
    dragOffset: { x: 0, y: 0 },
    originalDate: new Date(),
  })

  const [resizeState, setResizeState] = useState<EventResizeState>({
    isResizing: false,
    resizedEvent: null,
    resizeHandle: null,
    originalHeight: 0,
  })

  const [popoverState, setPopoverState] = useState<PopoverState>({
    isOpen: false,
    event: null,
    position: { x: 0, y: 0 },
  })

  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null)

  const [showDragModal, setShowDragModal] = useState(false)
  const [showResizeModal, setShowResizeModal] = useState(false)
  const [pendingDrag, setPendingDrag] = useState<PendingDrag | null>(null)
  const [pendingResize, setPendingResize] = useState<PendingResize | null>(null)

  // クリック判定用（ドラッグ/リサイズ中はPopoverを開かない）
  const [isDragStarted, setIsDragStarted] = useState(false)
  const [isResizeStarted, setIsResizeStarted] = useState(false)
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0, y: 0 })

  // インタラクション状態を追跡（mouseUp後もしばらく保持してclickに対応）
  const interactionEndTimeRef = useRef<number>(0)

  // インタラクション中かどうかの判定
  const isInteracting = useCallback(() => {
    // ドラッグ/リサイズ中、またはmouseUpから100ms以内
    return (
      dragState.isDragging ||
      resizeState.isResizing ||
      isDragStarted ||
      isResizeStarted ||
      Date.now() - interactionEndTimeRef.current < 100
    )
  }, [dragState.isDragging, resizeState.isResizing, isDragStarted, isResizeStarted])

  // Popoverを閉じる
  const closePopover = useCallback(() => {
    setPopoverState({ isOpen: false, event: null, position: { x: 0, y: 0 } })
  }, [])

  // Popoverを開く（インタラクション中は開かない）
  const openPopover = useCallback(
    (event: CalendarEvent, position: { x: number; y: number }) => {
      if (!isInteracting()) {
        setPopoverState({ isOpen: true, event, position })
      }
    },
    [isInteracting],
  )

  // マウスダウン
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, event: CalendarEvent, handle?: 'top' | 'bottom') => {
      e.preventDefault()
      e.stopPropagation()

      // インタラクション開始時にpopoverを閉じる
      closePopover()

      // マウスダウンの位置を記録
      setMouseDownPosition({ x: e.clientX, y: e.clientY })
      setIsDragStarted(false)
      setIsResizeStarted(false)

      if (handle) {
        // リサイズ開始
        setIsResizeStarted(true)
        const position = calculateEventPosition(event)
        setResizeState({
          isResizing: true,
          resizedEvent: event,
          resizeHandle: handle,
          originalHeight: position.height,
        })
      } else {
        // ドラッグ準備
        const rect = e.currentTarget.getBoundingClientRect()
        setDragState({
          isDragging: false,
          draggedEvent: event,
          dragOffset: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
          originalDate: new Date(event.startDate),
        })
      }
    },
    [closePopover],
  )

  // マウス移動
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const grid = gridRef.current
      if (!grid) return

      // ドラッグ開始判定
      if (dragState.draggedEvent && !dragState.isDragging && !isDragStarted) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - mouseDownPosition.x, 2) +
            Math.pow(e.clientY - mouseDownPosition.y, 2),
        )

        if (distance > 5) {
          setDragState((prev) => ({ ...prev, isDragging: true }))
          setIsDragStarted(true)
        }
      }

      // ドラッグ中のプレビュー更新
      if (dragState.isDragging && dragState.draggedEvent) {
        const gridRect = grid.getBoundingClientRect()
        const columnWidth = gridRect.width / dates.length
        const columnIndex = Math.floor((e.clientX - gridRect.left) / columnWidth)
        const clampedColumnIndex = Math.max(0, Math.min(columnIndex, dates.length - 1))

        const yPosition = e.clientY - gridRect.top
        const rawMinutes = (yPosition / TIME_SLOT_HEIGHT_PX) * TIME_SLOT_INTERVAL_MINUTES
        const snappedMinutes = Math.max(
          0,
          Math.min(
            Math.round(rawMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_INTERVAL_MINUTES,
            HOURS_PER_DAY * MINUTES_PER_HOUR - TIME_SLOT_INTERVAL_MINUTES,
          ),
        )

        const eventDuration =
          (new Date(dragState.draggedEvent.endDate).getTime() -
            new Date(dragState.draggedEvent.startDate).getTime()) /
          60000

        setDragPreview({
          columnIndex: clampedColumnIndex,
          startMinutes: snappedMinutes,
          height: (eventDuration / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX,
        })
      }

      // リサイズ中のプレビュー更新
      if (resizeState.isResizing && resizeState.resizedEvent) {
        const gridRect = grid.getBoundingClientRect()
        const yPosition = Math.max(0, e.clientY - gridRect.top)
        const rawMinutes = (yPosition / TIME_SLOT_HEIGHT_PX) * TIME_SLOT_INTERVAL_MINUTES
        const newTimeMinutes =
          Math.round(rawMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_INTERVAL_MINUTES

        const eventStart = new Date(resizeState.resizedEvent.startDate)
        const eventEnd = new Date(resizeState.resizedEvent.endDate)
        const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes()
        const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes()

        let newTop: number
        let newHeight: number

        if (resizeState.resizeHandle === 'top') {
          const clampedStart = Math.min(Math.max(0, newTimeMinutes), endMinutes - 30)
          newTop = (clampedStart / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
          newHeight =
            ((endMinutes - clampedStart) / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
        } else {
          const clampedEnd = Math.max(
            startMinutes + 30,
            Math.min(newTimeMinutes, HOURS_PER_DAY * MINUTES_PER_HOUR),
          )
          newTop = (startMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
          newHeight =
            ((clampedEnd - startMinutes) / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
        }

        setResizePreview({
          eventId: resizeState.resizedEvent.id,
          top: newTop,
          height: Math.max(TIME_SLOT_HEIGHT_PX, newHeight),
        })
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
      gridRef,
    ],
  )

  // マウスアップ
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const grid = gridRef.current

      // ドラッグ完了処理
      if (dragState.isDragging && dragState.draggedEvent && grid) {
        const gridRect = grid.getBoundingClientRect()
        const columnWidth = gridRect.width / dates.length
        const columnIndex = Math.floor((e.clientX - gridRect.left) / columnWidth)
        const newDate = dates[Math.max(0, Math.min(columnIndex, dates.length - 1))]

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
          const originalStart = new Date(dragState.draggedEvent.startDate)
          const originalStartMinutes = originalStart.getHours() * 60 + originalStart.getMinutes()
          const isSamePosition =
            isSameDay(originalStart, newDate) && originalStartMinutes === newStartMinutes

          if (!isSamePosition) {
            if (config.quickDragDrop !== false) {
              onEventDrop(dragState.draggedEvent, newDate, newStartMinutes)
            } else {
              closePopover()
              setPendingDrag({
                event: dragState.draggedEvent,
                newDate,
                newStartMinutes,
              })
              setShowDragModal(true)
            }
          }
        }
      }

      // リサイズ完了処理
      if (resizeState.isResizing && resizeState.resizedEvent && grid) {
        const gridRect = grid.getBoundingClientRect()
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
          newStartTime = Math.min(newTimeMinutes, endMinutes - 30)
          newStartTime = Math.max(0, newStartTime)
        } else if (resizeState.resizeHandle === 'bottom') {
          newEndTime = Math.max(newTimeMinutes, startMinutes + TIME_SLOT_INTERVAL_MINUTES)
          newEndTime = Math.min(HOURS_PER_DAY * MINUTES_PER_HOUR, newEndTime)
        }

        if (newStartTime !== startMinutes || newEndTime !== endMinutes) {
          if (config.quickResize) {
            onEventResize?.(resizeState.resizedEvent, newStartTime, newEndTime)
          } else {
            closePopover()
            setPendingResize({
              event: resizeState.resizedEvent,
              newStartTime,
              newEndTime,
            })
            setShowResizeModal(true)
          }
        }
      }

      // インタラクション終了時刻を記録（clickイベント判定用）
      if (dragState.isDragging || resizeState.isResizing || isDragStarted || isResizeStarted) {
        interactionEndTimeRef.current = Date.now()
      }

      // 状態リセット
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

      setIsDragStarted(false)
      setIsResizeStarted(false)
      setMouseDownPosition({ x: 0, y: 0 })
      setDragPreview(null)
      setResizePreview(null)
    },
    [
      dragState,
      resizeState,
      isDragStarted,
      isResizeStarted,
      dates,
      onEventDrop,
      onEventResize,
      config.quickResize,
      config.quickDragDrop,
      closePopover,
      gridRef,
    ],
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

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [
    dragState.isDragging,
    resizeState.isResizing,
    handleMouseMove,
    handleMouseUp,
    resizeState.resizeHandle,
  ])

  return {
    // 状態
    state: {
      dragState,
      resizeState,
      popoverState,
      dragPreview,
      resizePreview,
      showDragModal,
      showResizeModal,
      pendingDrag,
      pendingResize,
      isDragStarted,
      isResizeStarted,
    },

    // イベントハンドラー
    handlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    },

    // モーダルハンドラー
    modalHandlers: {
      handleResizeConfirm,
      handleResizeCancel,
      handleDragConfirm,
      handleDragCancel,
    },

    // アクション
    actions: {
      openPopover,
      closePopover,
      isInteracting,
    },
  }
}
