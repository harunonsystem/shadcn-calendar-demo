import { CalendarEvent, Language, CategoryColor } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Clock, Calendar, MapPin, Trash2, Edit2 } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'
import { getWeekDayName, getTranslation } from '@/lib/i18n'
import { getEventStyle } from './calendar-utils'
import { useEffect, useRef, useState } from 'react'

const MAX_TITLE_LENGTH = 30
const MAX_DESCRIPTION_LINES = 3
const POPOVER_WIDTH = 320
const POPOVER_HEIGHT = 280

interface EventPopoverProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  position: { x: number; y: number }
  categories?: CategoryColor[]
  onClose: () => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
  onOpenDetail?: (event: CalendarEvent) => void
}

export function EventPopover({
  event,
  language,
  isOpen,
  position,
  categories = [],
  onClose,
  onEdit,
  onDelete,
  onOpenDetail,
}: EventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!isOpen) return

    const calculatePosition = () => {
      let left = position.x
      let top = position.y

      if (left + POPOVER_WIDTH > window.innerWidth - 16) {
        left = Math.max(16, position.x - POPOVER_WIDTH - 16)
      }

      if (top + POPOVER_HEIGHT > window.innerHeight - 16) {
        top = window.innerHeight - POPOVER_HEIGHT - 16
      }

      if (top < 16) {
        top = 16
      }

      if (left < 16) {
        left = 16
      }

      setAdjustedPosition({ left, top })
    }

    calculatePosition()
  }, [isOpen, position])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  const t = getTranslation(language)
  const labels = t.eventPopover

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day} (${getWeekDayName(language, date.getDay())})`
  }

  const truncatedTitle =
    event.title.length > MAX_TITLE_LENGTH
      ? `${event.title.substring(0, MAX_TITLE_LENGTH)}...`
      : event.title

  return (
    <div
      ref={popoverRef}
      className="fixed z-50"
      style={{
        left: adjustedPosition.left,
        top: adjustedPosition.top,
        maxWidth: POPOVER_WIDTH,
      }}
    >
      <Card className="w-80 shadow-xl border max-h-[80vh] overflow-hidden flex flex-col">
        <div
          className="px-4 py-3 rounded-t-lg flex items-start justify-between flex-shrink-0"
          style={getEventStyle(event, { categoryColors: categories })}
        >
          <div className="flex-1 text-white min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate" title={event.title}>
              {truncatedTitle}
            </h3>
            {event.category && <span className="text-sm opacity-80">{event.category}</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 -mr-2 -mt-1 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4 space-y-3 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{formatDate(startDate)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>
              {event.allDay
                ? t.allDay
                : `${minutesToTimeString(startMinutes)} - ${minutesToTimeString(endMinutes)}`}
            </span>
          </div>

          {event.description && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p
                className="text-muted-foreground"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: MAX_DESCRIPTION_LINES,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {event.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onEdit?.(event)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              {labels.edit}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
              onClick={() => onDelete?.(event)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {labels.delete}
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-xs ml-auto"
              onClick={() => onOpenDetail?.(event)}
            >
              {labels.moreDetails}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
