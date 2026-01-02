import { atom } from 'jotai'
import type { CalendarEvent } from '@/types/calendar'

export const selectedEventAtom = atom<CalendarEvent | null>(null)
export const isEventDetailOpenAtom = atom<boolean>(false)

export const popoverStateAtom = atom<{
  isOpen: boolean
  event: CalendarEvent | null
  position: { x: number; y: number }
}>({
  isOpen: false,
  event: null,
  position: { x: 0, y: 0 },
})
