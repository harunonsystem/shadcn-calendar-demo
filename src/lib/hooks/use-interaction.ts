import { useCallback, useRef } from 'react'
import { useAtom } from 'jotai'
import {
  dragStateAtom,
  resizeStateAtom,
  isDragStartedAtom,
  mouseDownTimeAtom,
  mouseDownPositionAtom,
  dragPreviewAtom,
  showResizeModalAtom,
  pendingResizeAtom,
  showDragModalAtom,
  pendingDragAtom,
} from '@/lib/atoms'
import { CalendarEvent } from '@/types/calendar'
import {
  TIME_SLOT_HEIGHT_PX,
  TIME_SLOT_INTERVAL_MINUTES,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
} from '@/lib/constants'
import { isSameDay } from '@/lib/utils/date'

export const useInteraction = () => {
  const [dragState, setDragState] = useAtom(dragStateAtom)
  const [resizeState, setResizeState] = useAtom(resizeStateAtom)
  const [isDragStarted, setIsDragStarted] = useAtom(isDragStartedAtom)
  const [mouseDownTime, setMouseDownTime] = useAtom(mouseDownTimeAtom)
  const [mouseDownPosition, setMouseDownPosition] = useAtom(mouseDownPositionAtom)
  const [dragPreview, setDragPreview] = useAtom(dragPreviewAtom)
  const [showResizeModal, setShowResizeModal] = useAtom(showResizeModalAtom)
  const [pendingResize, setPendingResize] = useAtom(pendingResizeAtom)
  const [showDragModal, setShowDragModal] = useAtom(showDragModalAtom)
  const [pendingDrag, setPendingDrag] = useAtom(pendingDragAtom)

  const gridRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, event: CalendarEvent, handle?: 'top' | 'bottom') => {
      e.preventDefault()
      e.stopPropagation()

      setMouseDownTime(Date.now())
      setMouseDownPosition({ x: e.clientX, y: e.clientY })
      setIsDragStarted(false)

      if (handle) {
        setResizeState({
          isResizing: true,
          resizedEvent: event,
          resizeHandle: handle,
          originalHeight: 0,
        })
      } else {
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
    [setMouseDownTime, setMouseDownPosition, setIsDragStarted, setResizeState, setDragState],
  )

  const handleResizeConfirm = useCallback(() => {
    if (pendingResize) {
      // EventResize callback will be handled by the component
    }
    setShowResizeModal(false)
    setPendingResize(null)
  }, [pendingResize, setShowResizeModal, setPendingResize])

  const handleResizeCancel = useCallback(() => {
    setShowResizeModal(false)
    setPendingResize(null)
  }, [setShowResizeModal, setPendingResize])

  const handleDragConfirm = useCallback(() => {
    if (pendingDrag) {
      // EventDrop callback will be handled by the component
    }
    setShowDragModal(false)
    setPendingDrag(null)
  }, [pendingDrag, setShowDragModal, setPendingDrag])

  const handleDragCancel = useCallback(() => {
    setShowDragModal(false)
    setPendingDrag(null)
  }, [setShowDragModal, setPendingDrag])

  const resetInteraction = useCallback(() => {
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
    setMouseDownTime(0)
    setMouseDownPosition({ x: 0, y: 0 })
    setDragPreview(null)
  }, [
    setDragState,
    setResizeState,
    setIsDragStarted,
    setMouseDownTime,
    setMouseDownPosition,
    setDragPreview,
  ])

  return {
    dragState,
    resizeState,
    isDragStarted,
    mouseDownTime,
    mouseDownPosition,
    dragPreview,
    showResizeModal,
    pendingResize,
    showDragModal,
    pendingDrag,
    gridRef,
    handleMouseDown,
    handleResizeConfirm,
    handleResizeCancel,
    handleDragConfirm,
    handleDragCancel,
    resetInteraction,
    setDragState,
    setResizeState,
    setDragPreview,
    setShowResizeModal,
    setPendingResize,
    setShowDragModal,
    setPendingDrag,
    setIsDragStarted,
  }
}
