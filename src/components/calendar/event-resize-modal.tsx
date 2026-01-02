import { CalendarEvent, Language, CategoryColor } from '@/types/calendar'
import { Clock, ArrowRight } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'
import { EventConfirmModal } from './event-confirm-modal'

interface EventResizeModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  newStartTime: number
  newEndTime: number
  categoryColors?: CategoryColor[]
  onConfirm: () => void
  onCancel: () => void
}

export function EventResizeModal({
  event,
  language,
  isOpen,
  newStartTime,
  newEndTime,
  categoryColors = [],
  onConfirm,
  onCancel,
}: EventResizeModalProps) {
  if (!event) return null

  const t = {
    ja: {
      confirmResize: '時間を変更',
      confirm: '変更する',
      cancel: 'キャンセル',
    },
    en: {
      confirmResize: 'Change Time',
      confirm: 'Change',
      cancel: 'Cancel',
    },
  }

  const labels = t[language]

  const oldStartMinutes =
    new Date(event.startDate).getHours() * 60 + new Date(event.startDate).getMinutes()
  const oldEndMinutes =
    new Date(event.endDate).getHours() * 60 + new Date(event.endDate).getMinutes()

  const startChanged = oldStartMinutes !== newStartTime
  const endChanged = oldEndMinutes !== newEndTime

  return (
    <EventConfirmModal
      isOpen={isOpen}
      title={labels.confirmResize}
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {minutesToTimeString(oldStartMinutes)} - {minutesToTimeString(oldEndMinutes)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>

        {/* New */}
        <div className="flex-1 p-4 rounded-lg bg-primary/10 border-2 border-primary">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <span className={startChanged ? 'text-primary font-medium' : ''}>
                {minutesToTimeString(newStartTime)}
              </span>
              {' - '}
              <span className={endChanged ? 'text-primary font-medium' : ''}>
                {minutesToTimeString(newEndTime)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </EventConfirmModal>
  )
}
