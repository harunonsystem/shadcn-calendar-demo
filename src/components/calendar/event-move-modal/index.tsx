import { CalendarEvent, Language, CategoryColor } from '@/types/calendar'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'
import { getWeekDayName } from '../calendar-utils'
import { EventConfirmModal } from '../event-confirm-modal'

interface EventMoveModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  newDate: Date | null
  newStartMinutes: number
  categoryColors?: CategoryColor[]
  onConfirm: () => void
  onCancel: () => void
}

export function EventMoveModal({
  event,
  language,
  isOpen,
  newDate,
  newStartMinutes,
  categoryColors = [],
  onConfirm,
  onCancel,
}: EventMoveModalProps) {
  if (!event || !newDate) return null

  const t = {
    ja: {
      confirmMove: 'イベントを移動',
      confirm: '移動する',
      cancel: 'キャンセル',
    },
    en: {
      confirmMove: 'Move Event',
      confirm: 'Move',
      cancel: 'Cancel',
    },
  }

  const labels = t[language]

  const oldStart = new Date(event.startDate)
  const oldEnd = new Date(event.endDate)
  const duration = (oldEnd.getTime() - oldStart.getTime()) / (1000 * 60)
  const oldStartMinutes = oldStart.getHours() * 60 + oldStart.getMinutes()
  const newEndMinutes = newStartMinutes + duration

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day} (${getWeekDayName(language, date.getDay())})`
  }

  const isSameDate =
    oldStart.getFullYear() === newDate.getFullYear() &&
    oldStart.getMonth() === newDate.getMonth() &&
    oldStart.getDate() === newDate.getDate()

  const isSameTime = oldStartMinutes === newStartMinutes

  return (
    <EventConfirmModal
      isOpen={isOpen}
      title={labels.confirmMove}
      event={event}
      categoryColors={categoryColors}
      confirmLabel={labels.confirm}
      cancelLabel={labels.cancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {/* Change Visualization */}
      <div className="flex items-center gap-3">
        {/* Old */}
        <div className="flex-1 p-4 rounded-lg bg-muted/50 border border-muted">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{formatDate(oldStart)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {minutesToTimeString(oldStartMinutes)} -{' '}
              {minutesToTimeString(oldStartMinutes + duration)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>

        {/* New */}
        <div className="flex-1 p-4 rounded-lg bg-primary/10 border-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className={`text-sm font-medium ${!isSameDate ? 'text-primary' : ''}`}>
              {formatDate(newDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className={`text-sm ${!isSameTime ? 'text-primary font-medium' : ''}`}>
              {minutesToTimeString(newStartMinutes)} - {minutesToTimeString(newEndMinutes)}
            </span>
          </div>
        </div>
      </div>
    </EventConfirmModal>
  )
}
