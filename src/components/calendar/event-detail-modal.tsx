import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DateTimePicker } from '@/components/datepicker'
import { X, Clock, MapPin, User, Tag, Edit2, Save } from 'lucide-react'
import { getEventStyle } from './calendar-utils'
import { formatDateTime, calculateDuration } from '@/lib/utils/time'
import { useState, useEffect, useCallback } from 'react'

interface EventDetailModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  onClose: () => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
  onUpdate?: (updatedEvent: CalendarEvent) => void
}

export function EventDetailModal({
  event,
  language,
  isOpen,
  onClose,
  onEdit: _onEdit,
  onDelete,
  onUpdate,
}: EventDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null)

  // Escキーでモーダルを閉じる（編集モード中はキャンセル）
  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditMode) {
          setEditedEvent(null)
          setIsEditMode(false)
        } else {
          onClose()
        }
      }
    },
    [isEditMode, onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, handleEscKey])

  if (!isOpen || !event) return null

  // Initialize edit state when entering edit mode
  const handleEditStart = () => {
    setEditedEvent({ ...event })
    setIsEditMode(true)
  }

  const handleEditCancel = () => {
    setEditedEvent(null)
    setIsEditMode(false)
  }

  const handleEditSave = () => {
    if (editedEvent && onUpdate) {
      onUpdate(editedEvent)
      setIsEditMode(false)
      setEditedEvent(null)
    }
  }

  const currentEvent = isEditMode ? editedEvent : event
  if (!currentEvent) return null

  const t = {
    ja: {
      eventDetails: 'イベント詳細',
      startTime: '開始時間',
      endTime: '終了時間',
      duration: '時間',
      category: 'カテゴリー',
      description: '説明',
      edit: '編集',
      delete: '削除',
      close: '閉じる',
      save: '保存',
      cancel: 'キャンセル',
      noDescription: '説明がありません',
    },
    en: {
      eventDetails: 'Event Details',
      startTime: 'Start Time',
      endTime: 'End Time',
      duration: 'Duration',
      category: 'Category',
      description: 'Description',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      noDescription: 'No description',
    },
  }

  const labels = t[language]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold pr-8">{currentEvent.title}</CardTitle>
              <div className="mt-2">
                <Badge variant="secondary" className="text-sm" style={getEventStyle(currentEvent)}>
                  <div className="text-white font-medium">
                    {currentEvent.category || 'イベント'}
                  </div>
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Start Time */}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              {isEditMode ? (
                <DateTimePicker
                  value={new Date(currentEvent.startDate)}
                  onChange={(date) =>
                    setEditedEvent((prev) => (prev ? { ...prev, startDate: date } : null))
                  }
                  label={labels.startTime}
                />
              ) : (
                <div>
                  <div className="text-sm font-medium">{labels.startTime}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(new Date(currentEvent.startDate), language)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* End Time */}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              {isEditMode ? (
                <DateTimePicker
                  value={new Date(currentEvent.endDate)}
                  onChange={(date) =>
                    setEditedEvent((prev) => (prev ? { ...prev, endDate: date } : null))
                  }
                  label={labels.endTime}
                />
              ) : (
                <div>
                  <div className="text-sm font-medium">{labels.endTime}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(new Date(currentEvent.endDate), language)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{labels.duration}</div>
              <div className="text-sm text-muted-foreground">
                {calculateDuration(
                  new Date(currentEvent.startDate),
                  new Date(currentEvent.endDate),
                  language,
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          {currentEvent.category && (
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{labels.category}</div>
                <div className="text-sm text-muted-foreground">{currentEvent.category}</div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <div className="text-sm font-medium">{labels.description}</div>
              <div className="text-sm text-muted-foreground">
                {currentEvent.description || labels.noDescription}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {isEditMode ? (
              <>
                <Button variant="outline" size="sm" onClick={handleEditCancel} className="flex-1">
                  {labels.cancel}
                </Button>
                <Button size="sm" onClick={handleEditSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {labels.save}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleEditStart} className="flex-1">
                  <Edit2 className="h-4 w-4 mr-2" />
                  {labels.edit}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(event)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  {labels.delete}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
