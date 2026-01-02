import { atom } from 'jotai'
import type { CalendarEvent, CalendarConfig } from '@/types/calendar'

export const currentDateAtom = atom<Date>(new Date())

export const eventsAtom = atom<CalendarEvent[]>([])

export const configAtom = atom<CalendarConfig>({
  showNowIndicator: true,
  nowIndicatorColor: '#ef4444',
  language: 'ja',
  defaultView: 'month',
  enableDragDrop: true,
  enableResize: true,
  eventStackMode: 'stack',
  quickResize: false,
  quickDragDrop: false,
  firstDayOfWeek: 0,
})
