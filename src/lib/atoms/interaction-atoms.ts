import { atom } from 'jotai'
import type { CalendarEvent } from '@/types/calendar'

export const dragStateAtom = atom<{
  isDragging: boolean
  draggedEvent: CalendarEvent | null
  dragOffset: { x: number; y: number }
  originalDate: Date
}>({
  isDragging: false,
  draggedEvent: null,
  dragOffset: { x: 0, y: 0 },
  originalDate: new Date(),
})

export const resizeStateAtom = atom<{
  isResizing: boolean
  resizedEvent: CalendarEvent | null
  resizeHandle: 'top' | 'bottom' | null
  originalHeight: number
}>({
  isResizing: false,
  resizedEvent: null,
  resizeHandle: null,
  originalHeight: 0,
})

export const isDragStartedAtom = atom<boolean>(false)
export const mouseDownTimeAtom = atom<number>(0)
export const mouseDownPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 })

export const dragPreviewAtom = atom<{
  columnIndex: number
  startMinutes: number
  height: number
} | null>(null)

export const showResizeModalAtom = atom<boolean>(false)
export const pendingResizeAtom = atom<{
  event: CalendarEvent
  newStartTime: number
  newEndTime: number
} | null>(null)

export const showDragModalAtom = atom<boolean>(false)
export const pendingDragAtom = atom<{
  event: CalendarEvent
  newDate: Date
  newStartMinutes: number
} | null>(null)

export const showAddEventModalAtom = atom<boolean>(false)
export const addEventInitialDataAtom = atom<{
  date: Date
  startMinutes: number
} | null>(null)
