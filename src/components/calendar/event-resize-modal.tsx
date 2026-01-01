import { useEffect, useCallback } from 'react'
import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Clock } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'

interface EventResizeModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  newStartTime: number
  newEndTime: number
  onConfirm: () => void
  onCancel: () => void
}

export function EventResizeModal({
  event,
  language,
  isOpen,
  newStartTime,
  newEndTime,
  onConfirm,
  onCancel,
}: EventResizeModalProps) {
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

  if (!isOpen || !event) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <Card className="relative w-full max-w-lg mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{labels.confirmResize}</CardTitle>
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
