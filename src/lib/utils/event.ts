import { CalendarEvent } from '@/types/calendar'
import { isSameDay } from './date'

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter((event) => isSameDay(new Date(event.startDate), date))
}

export const getEventsInRange = (
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
): CalendarEvent[] => {
  const start = startDate.getTime()
  const end = endDate.getTime()

  return events.filter((event) => {
    const eventStart = new Date(event.startDate).getTime()
    const eventEnd = new Date(event.endDate).getTime()
    return eventStart < end && eventEnd > start
  })
}

export const getEventsByCategory = (events: CalendarEvent[], category: string): CalendarEvent[] => {
  return events.filter((event) => event.category === category)
}

export const groupEventsByCategory = (events: CalendarEvent[]): Map<string, CalendarEvent[]> => {
  const groups = new Map<string, CalendarEvent[]>()

  for (const event of events) {
    const category = event.category || 'その他'
    const existing = groups.get(category) || []
    groups.set(category, [...existing, event])
  }

  return groups
}

export const getUniqueCategories = (events: CalendarEvent[]): string[] => {
  const categories = new Set<string>()
  for (const event of events) {
    if (event.category) {
      categories.add(event.category)
    }
  }
  return Array.from(categories).sort()
}
