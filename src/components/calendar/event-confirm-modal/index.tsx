import { useEffect, useCallback, ReactNode } from 'react'
import { CalendarEvent } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEventStyle } from '../calendar-utils'
import { CategoryColor } from '@/types/calendar'

interface EventConfirmModalProps {
  isOpen: boolean
  title: string
  event: CalendarEvent | null
  categoryColors?: CategoryColor[]
  confirmLabel: string
  cancelLabel: string
  children: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

/**
 * イベント操作確認モーダルの共通ベースコンポーネント
 * EventMoveModal, EventResizeModal, EventCategoryChangeModal で使用
 */
export function EventConfirmModal({
  isOpen,
  title,
  event,
  categoryColors = [],
  confirmLabel,
  cancelLabel,
  children,
  onConfirm,
  onCancel,
}: EventConfirmModalProps) {
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

  const eventStyle = getEventStyle(event, { categoryColors })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <Card className="relative w-full max-w-lg mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Event Title */}
          <div
            className="px-3 py-2 rounded-lg text-white font-medium"
            style={{
              backgroundColor: eventStyle.backgroundColor,
              borderLeft: `4px solid ${eventStyle.borderColor}`,
            }}
          >
            {event.title}
          </div>

          {/* Custom Content */}
          {children}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
