import { useState, useCallback, useRef, useEffect } from 'react'
import { CalendarEvent } from '@/types/calendar'
import { isSameDay } from '@/lib/utils/date'

const DRAG_THRESHOLD_PX = 5 // この距離以上動いたらドラッグ開始

interface AllDayDragState {
  isDragging: boolean
  draggedEvent: CalendarEvent | null
  targetColumnIndex: number | null
}

interface UseAllDayRowInteractionOptions {
  dates: Date[]
  rowRef: React.RefObject<HTMLDivElement | null>
  onEventDrop?: (event: CalendarEvent, newDate: Date) => void
}

/**
 * AllDayRowのドラッグ操作を管理するカスタムフック
 * useTimeGridInteractionと同様のパターンでロジックをカプセル化
 */
export function useAllDayRowInteraction({
  dates,
  rowRef,
  onEventDrop,
}: UseAllDayRowInteractionOptions) {
  const [dragState, setDragState] = useState<AllDayDragState>({
    isDragging: false,
    draggedEvent: null,
    targetColumnIndex: null,
  })

  // ドラッグ終了後のクリック抑制用（useTimeGridInteractionと同様）
  const interactionEndTimeRef = useRef<number>(0)
  // マウスダウン時の位置（ドラッグ判定用）
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null)
  // ドラッグが実際に開始されたかどうか
  const isDragStartedRef = useRef<boolean>(false)
  // 保留中のイベント（mouseDown時に保持）
  const pendingEventRef = useRef<CalendarEvent | null>(null)

  // ドラッグ中かどうか判定（ドラッグ終了後100ms以内も含む）
  const isInteracting = useCallback(() => {
    return (
      dragState.isDragging ||
      isDragStartedRef.current ||
      Date.now() - interactionEndTimeRef.current < 100
    )
  }, [dragState.isDragging])

  // 列インデックスを計算
  const calculateColumnIndex = useCallback(
    (clientX: number): number => {
      if (!rowRef.current) return 0

      const rect = rowRef.current.getBoundingClientRect()
      const columnWidth = rect.width / dates.length
      const x = clientX - rect.left
      const columnIndex = Math.floor(x / columnWidth)
      return Math.max(0, Math.min(columnIndex, dates.length - 1))
    },
    [dates.length, rowRef],
  )

  // マウスダウンハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent, event: CalendarEvent) => {
    e.preventDefault()
    // stopPropagationは呼ばない（クリックイベント用）

    mouseDownPosRef.current = { x: e.clientX, y: e.clientY }
    pendingEventRef.current = event
    isDragStartedRef.current = false
  }, [])

  // グローバルマウスイベントリスナー
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownPosRef.current || !pendingEventRef.current) return

      // 移動距離を計算
      const dx = e.clientX - mouseDownPosRef.current.x
      const dy = e.clientY - mouseDownPosRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 閾値を超えたらドラッグ開始
      if (distance >= DRAG_THRESHOLD_PX && !isDragStartedRef.current) {
        isDragStartedRef.current = true
        setDragState({
          isDragging: true,
          draggedEvent: pendingEventRef.current,
          targetColumnIndex: null,
        })
      }

      // ドラッグ中は列インデックスを更新
      if (isDragStartedRef.current) {
        const columnIndex = calculateColumnIndex(e.clientX)
        setDragState((prev) => ({
          ...prev,
          targetColumnIndex: columnIndex,
        }))
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!pendingEventRef.current) return

      // ドラッグが開始されていた場合のみドロップ処理
      if (isDragStartedRef.current) {
        const columnIndex = calculateColumnIndex(e.clientX)
        const newDate = dates[columnIndex]
        const draggedEvent = pendingEventRef.current

        if (newDate && !isSameDay(new Date(draggedEvent.startDate), newDate)) {
          onEventDrop?.(draggedEvent, newDate)
        }

        interactionEndTimeRef.current = Date.now()
        setDragState({
          isDragging: false,
          draggedEvent: null,
          targetColumnIndex: null,
        })
      }
      // ドラッグが開始されていなかった場合はクリックとして扱う（clickイベントで処理）

      // リセット
      mouseDownPosRef.current = null
      pendingEventRef.current = null
      isDragStartedRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dates, calculateColumnIndex, onEventDrop])

  return {
    state: {
      dragState,
    },
    actions: {
      isInteracting,
    },
    handlers: {
      handleMouseDown,
    },
  }
}
