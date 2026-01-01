import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/datepicker'
import { X, Edit2, Save } from 'lucide-react'
import { getEventStyle } from './calendar-utils'
import { formatDateTime, calculateDuration } from '@/lib/utils/time'
import { getTranslation } from '@/lib/i18n'
import { DEFAULT_EVENT_COLOR, DEFAULT_BORDER_COLOR } from '@/lib/constants'
import { useState, useEffect, useCallback } from 'react'

interface Category {
  category: string
  label: string
  backgroundColor?: string
  borderColor?: string
}

interface EventDetailModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  categories?: Category[]
  initialEditMode?: boolean
  onClose: () => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
  onUpdate?: (updatedEvent: CalendarEvent) => void
}

export function EventDetailModal({
  event,
  language,
  isOpen,
  categories = [],
  initialEditMode = false,
  onClose,
  onEdit: _onEdit,
  onDelete,
  onUpdate,
}: EventDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(null)

  // モーダルが開くたびにinitialEditModeに基づいて状態をリセット
  useEffect(() => {
    if (isOpen && event) {
      if (initialEditMode) {
        setIsEditMode(true)
        setEditedEvent({ ...event })
      } else {
        setIsEditMode(false)
        setEditedEvent(null)
      }
    }
  }, [isOpen, initialEditMode, event])

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

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((c) => c.category === value)
    setEditedEvent((prev) =>
      prev
        ? {
            ...prev,
            category: value,
            backgroundColor: selectedCategory?.backgroundColor,
            borderColor: selectedCategory?.borderColor,
          }
        : null,
    )
  }

  const currentEvent = isEditMode ? editedEvent : event
  if (!currentEvent) return null

  const t = getTranslation(language)
  const labels = t.eventDetailModal

  // categoriesからcategoryColors形式のconfigを構築
  const configForStyle = {
    categoryColors: categories.map((c) => ({
      label: c.category,
      backgroundColor: c.backgroundColor || DEFAULT_EVENT_COLOR,
      borderColor: c.borderColor || DEFAULT_BORDER_COLOR,
    })),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <Card className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              {!isEditMode && (
                <>
                  <CardTitle className="text-xl font-bold">{currentEvent.title}</CardTitle>
                  {currentEvent.category && (
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className="text-sm"
                        style={getEventStyle(currentEvent, configForStyle)}
                      >
                        <div className="text-white font-medium">{currentEvent.category}</div>
                      </Badge>
                    </div>
                  )}
                </>
              )}
              {isEditMode && (
                <CardTitle className="text-xl font-bold">{labels.eventTitle}</CardTitle>
              )}
            </div>
            <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title (edit mode only) */}
          {isEditMode && (
            <div className="space-y-2">
              <Label>{labels.eventTitle}</Label>
              <Input
                value={currentEvent.title}
                onChange={(e) =>
                  setEditedEvent((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                autoFocus
              />
            </div>
          )}

          {/* Start Time */}
          <div className="space-y-2">
            {isEditMode ? (
              <DateTimePicker
                value={new Date(currentEvent.startDate)}
                onChange={(date) =>
                  setEditedEvent((prev) => (prev ? { ...prev, startDate: date } : null))
                }
                label={labels.startTime}
                language={language}
              />
            ) : (
              <>
                <div className="text-sm font-medium">{labels.startTime}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(new Date(currentEvent.startDate), language)}
                </div>
              </>
            )}
          </div>

          {/* End Time */}
          <div className="space-y-2">
            {isEditMode ? (
              <DateTimePicker
                value={new Date(currentEvent.endDate)}
                onChange={(date) =>
                  setEditedEvent((prev) => (prev ? { ...prev, endDate: date } : null))
                }
                label={labels.endTime}
                language={language}
              />
            ) : (
              <>
                <div className="text-sm font-medium">{labels.endTime}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(new Date(currentEvent.endDate), language)}
                </div>
              </>
            )}
          </div>

          {/* Duration (read-only) */}
          {!isEditMode && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{labels.duration}</div>
              <div className="text-sm text-muted-foreground">
                {calculateDuration(
                  new Date(currentEvent.startDate),
                  new Date(currentEvent.endDate),
                  language,
                )}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <Label>{t.addEventModal.category}</Label>
                {categories.length > 0 ? (
                  <Select value={currentEvent.category || ''} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.addEventModal.categoryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.category} value={cat.category}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.backgroundColor }}
                            />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={currentEvent.category || ''}
                    onChange={(e) =>
                      setEditedEvent((prev) =>
                        prev ? { ...prev, category: e.target.value } : null,
                      )
                    }
                    placeholder={t.addEventModal.categoryPlaceholder}
                  />
                )}
              </>
            ) : currentEvent.category ? (
              <>
                <div className="text-sm font-medium">{t.addEventModal.category}</div>
                <div className="text-sm text-muted-foreground">{currentEvent.category}</div>
              </>
            ) : null}
          </div>

          {/* Description */}
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <Label>{t.addEventModal.description}</Label>
                <Textarea
                  value={currentEvent.description || ''}
                  onChange={(e) =>
                    setEditedEvent((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                  placeholder={t.addEventModal.descriptionPlaceholder}
                  rows={3}
                />
              </>
            ) : (
              <>
                <div className="text-sm font-medium">{t.addEventModal.description}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {currentEvent.description || labels.noDescription}
                </div>
              </>
            )}
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
