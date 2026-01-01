import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import { DateTimePicker } from '@/components/datepicker'

interface AddEventModalProps {
  language: Language
  isOpen: boolean
  initialDate?: Date
  initialStartMinutes?: number
  onClose: () => void
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void
}

export function AddEventModal({
  language,
  isOpen,
  initialDate,
  initialStartMinutes = 9 * 60, // デフォルト9:00
  onClose,
  onCreate,
}: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = initialDate ? new Date(initialDate) : new Date()
    date.setHours(Math.floor(initialStartMinutes / 60), initialStartMinutes % 60, 0, 0)
    return date
  })
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = initialDate ? new Date(initialDate) : new Date()
    date.setHours(
      Math.floor((initialStartMinutes + 60) / 60),
      (initialStartMinutes + 60) % 60,
      0,
      0,
    )
    return date
  })

  // 初期日時の設定
  useEffect(() => {
    if (isOpen && initialDate) {
      const start = new Date(initialDate)
      start.setHours(Math.floor(initialStartMinutes / 60), initialStartMinutes % 60, 0, 0)
      setStartDate(start)

      const end = new Date(initialDate)
      end.setHours(
        Math.floor((initialStartMinutes + 60) / 60),
        (initialStartMinutes + 60) % 60,
        0,
        0,
      )
      setEndDate(end)

      // フォームをリセット
      setTitle('')
      setDescription('')
      setCategory('')
    }
  }, [isOpen, initialDate, initialStartMinutes])

  // Escキーで閉じる
  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, handleEscKey])

  if (!isOpen) return null

  const t = {
    ja: {
      addEvent: '新規イベント',
      title: 'タイトル',
      titlePlaceholder: 'イベント名を入力',
      startTime: '開始日時',
      endTime: '終了日時',
      description: '説明',
      descriptionPlaceholder: '説明を入力（任意）',
      category: 'カテゴリ',
      categoryPlaceholder: 'カテゴリ名（任意）',
      create: '作成',
      cancel: 'キャンセル',
    },
    en: {
      addEvent: 'New Event',
      title: 'Title',
      titlePlaceholder: 'Enter event name',
      startTime: 'Start Time',
      endTime: 'End Time',
      description: 'Description',
      descriptionPlaceholder: 'Enter description (optional)',
      category: 'Category',
      categoryPlaceholder: 'Category name (optional)',
      create: 'Create',
      cancel: 'Cancel',
    },
  }

  const labels = t[language]

  const handleCreate = () => {
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      startDate,
      endDate,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {labels.addEvent}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="event-title">{labels.title}</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={labels.titlePlaceholder}
              autoFocus
            />
          </div>

          {/* Start Time */}
          <DateTimePicker
            value={startDate}
            onChange={setStartDate}
            label={labels.startTime}
            language={language}
          />

          {/* End Time */}
          <DateTimePicker
            value={endDate}
            onChange={setEndDate}
            label={labels.endTime}
            language={language}
          />

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="event-category">{labels.category}</Label>
            <Input
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={labels.categoryPlaceholder}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="event-description">{labels.description}</Label>
            <Input
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={labels.descriptionPlaceholder}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {labels.cancel}
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim()} className="flex-1">
              {labels.create}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
