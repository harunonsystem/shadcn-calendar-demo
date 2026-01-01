import { useEffect, useCallback } from 'react'
import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'
import { getWeekDayName } from './calendar-utils'

interface EventMoveModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  newDate: Date | null
  newStartMinutes: number
  onConfirm: () => void
  onCancel: () => void
}

export function EventMoveModal({
  event,
  language,
  isOpen,
  newDate,
  newStartMinutes,
  onConfirm,
  onCancel,
}: EventMoveModalProps) {
  // Escキーでモーダルを閉じる
  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    },
    [onCancel],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, handleEscKey])

  if (!isOpen || !event || !newDate) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <Card className="relative w-full max-w-lg mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{labels.confirmMove}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Event Title */}
          <div
            className="px-3 py-2 rounded-lg text-white font-medium"
            style={{
              backgroundColor: event.backgroundColor || '#3b82f6',
              borderLeft: `4px solid ${event.borderColor || '#1d4ed8'}`,
            }}
          >
            {event.title}
          </div>

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

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {labels.cancel}
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              {labels.confirm}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
