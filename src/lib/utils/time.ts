import { CalendarEvent, Language } from '@/types/calendar'
import {
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MINUTES_PER_HOUR,
  TIME_SLOT_HEIGHT_PX,
  TIME_SLOT_INTERVAL_MINUTES,
  MIN_EVENT_HEIGHT_PX,
  STACK_MODE_WIDTH_PERCENT,
  STACK_MODE_OFFSET_PERCENT,
  COLUMN_MODE_GAP_PERCENT,
  EVENT_DISPLAY_THRESHOLDS,
} from '../constants'
import { getTranslation } from '@/lib/i18n'

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export const formatTimeRange = (startDate: Date, endDate: Date): string => {
  return `${formatTime(startDate)} - ${formatTime(endDate)}`
}

export const formatDateTime = (date: Date, language: Language): string => {
  const t = getTranslation(language)
  const dateStr = date.toLocaleDateString(t.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  return `${dateStr} ${formatTime(date)}`
}

export const calculateDuration = (startDate: Date, endDate: Date, language: Language): string => {
  const t = getTranslation(language)
  const diffMs = endDate.getTime() - startDate.getTime()

  const MS_PER_DAY = MS_PER_HOUR * 24
  const diffDays = Math.floor(diffMs / MS_PER_DAY)
  const diffHours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR)
  const diffMinutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE)

  const parts: string[] = []
  if (diffDays > 0) parts.push(`${diffDays}${t.units.days}`)
  if (diffHours > 0) parts.push(`${diffHours}${t.units.hours}`)
  if (diffMinutes > 0) parts.push(`${diffMinutes}${t.units.minutes}`)

  return parts.length > 0 ? parts.join('') : `0${t.units.minutes}`
}

export const calculateEventPosition = (event: CalendarEvent): { top: number; height: number } => {
  const eventStart = new Date(event.startDate)
  const eventEnd = new Date(event.endDate)

  const startMinutes = eventStart.getHours() * MINUTES_PER_HOUR + eventStart.getMinutes()
  const endMinutes = eventEnd.getHours() * MINUTES_PER_HOUR + eventEnd.getMinutes()

  const startPosition = (startMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
  const duration = Math.max(
    ((endMinutes - startMinutes) / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX,
    MIN_EVENT_HEIGHT_PX,
  )

  return {
    top: startPosition,
    height: duration,
  }
}

export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  const mins = minutes % MINUTES_PER_HOUR
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export const timeStringToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * MINUTES_PER_HOUR + minutes
}

export const getCurrentTimeInMinutes = (): number => {
  const now = new Date()
  return now.getHours() * MINUTES_PER_HOUR + now.getMinutes()
}

export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export const getEventDisplayInfo = (height: number) => {
  return {
    showTitle: height >= EVENT_DISPLAY_THRESHOLDS.showTitle,
    showTime: height >= EVENT_DISPLAY_THRESHOLDS.showTime,
    showDescription: height >= EVENT_DISPLAY_THRESHOLDS.showDescription,
    canShowFullDetails: height >= EVENT_DISPLAY_THRESHOLDS.showFullDetails,
  }
}

export const getMonthEventTitle = (event: CalendarEvent): string => {
  // 終日イベントは時刻表示なし
  if (event.allDay) {
    return event.title
  }
  const timeStr = formatTime(new Date(event.startDate))
  return `${timeStr} ${event.title}`
}

export const getTimeGridEventInfo = (event: CalendarEvent) => {
  const position = calculateEventPosition(event)
  const displayInfo = getEventDisplayInfo(position.height)

  return {
    position,
    displayInfo,
    timeRange: formatTimeRange(new Date(event.startDate), new Date(event.endDate)),
  }
}

export const getNowIndicatorPositionForTimeGrid = (): number => {
  const currentMinutes = getCurrentTimeInMinutes()
  return (currentMinutes / TIME_SLOT_INTERVAL_MINUTES) * TIME_SLOT_HEIGHT_PX
}

export const eventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  const start1 = new Date(event1.startDate).getTime()
  const end1 = new Date(event1.endDate).getTime()
  const start2 = new Date(event2.startDate).getTime()
  const end2 = new Date(event2.endDate).getTime()

  return start1 < end2 && start2 < end1
}

export const groupOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[][] => {
  const groups: CalendarEvent[][] = []
  const processed = new Set<string>()

  for (const event of events) {
    if (processed.has(event.id)) continue

    const group = [event]
    processed.add(event.id)

    for (const otherEvent of events) {
      if (processed.has(otherEvent.id)) continue

      if (group.some((groupEvent) => eventsOverlap(groupEvent, otherEvent))) {
        group.push(otherEvent)
        processed.add(otherEvent.id)
      }
    }

    groups.push(group)
  }

  return groups
}

export const calculateOverlapLayout = (
  events: CalendarEvent[],
  mode: 'stack' | 'column' = 'column',
): Array<{ event: CalendarEvent; width: number; left: number; zIndex: number }> => {
  if (events.length <= 1) {
    return events.map((event) => ({ event, width: 100, left: 0, zIndex: 1 }))
  }

  if (mode === 'stack') {
    return events.map((event, index) => ({
      event,
      width: STACK_MODE_WIDTH_PERCENT,
      left: index * STACK_MODE_OFFSET_PERCENT,
      zIndex: events.length - index,
    }))
  } else {
    const columnWidth = 100 / events.length
    return events.map((event, index) => ({
      event,
      width: columnWidth - COLUMN_MODE_GAP_PERCENT,
      left: index * columnWidth,
      zIndex: 1,
    }))
  }
}
