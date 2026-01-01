import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { X, Plus } from 'lucide-react'
import { DateTimePicker } from '@/components/datepicker'
import { getTranslation } from '@/lib/i18n'

interface Category {
  category: string
  label: string
  backgroundColor?: string
  borderColor?: string
}

interface AddEventModalProps {
  language: Language
  isOpen: boolean
  initialDate?: Date
  initialStartMinutes?: number
  categories?: Category[]
  onClose: () => void
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void
}

export function AddEventModal({
  language,
  isOpen,
  initialDate,
  initialStartMinutes = 9 * 60,
  categories = [],
  onClose,
  onCreate,
}: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [allDay, setAllDay] = useState(false)
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

      setTitle('')
      setDescription('')
      setCategory('')
      setAllDay(false)
    }
  }, [isOpen, initialDate, initialStartMinutes])

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

  const t = getTranslation(language)
  const labels = t.addEventModal

  // 選択されたカテゴリの色を取得
  const selectedCategoryData = categories.find((c) => c.category === category)

  const handleCreate = () => {
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      backgroundColor: selectedCategoryData?.backgroundColor,
      borderColor: selectedCategoryData?.borderColor,
      startDate,
      endDate,
      allDay,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <Card className="relative w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {labels.title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title (Required) */}
          <div className="space-y-2">
            <Label htmlFor="event-title">
              {labels.eventTitle}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={labels.eventTitlePlaceholder}
              autoFocus
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="event-allday"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="event-allday" className="cursor-pointer">
              {labels.allDay}
            </Label>
          </div>

          {/* Start Time/Date */}
          <DateTimePicker
            value={startDate}
            onChange={setStartDate}
            label={allDay ? labels.startDate : labels.startTime}
            language={language}
            hideTime={allDay}
          />

          {/* End Time/Date */}
          <DateTimePicker
            value={endDate}
            onChange={setEndDate}
            label={allDay ? labels.endDate : labels.endTime}
            language={language}
            hideTime={allDay}
          />

          {/* Category Select */}
          <div className="space-y-2">
            <Label>{labels.category}</Label>
            {categories.length > 0 ? (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={labels.categoryPlaceholder} />
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={labels.categoryPlaceholder}
              />
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="event-description">{labels.description}</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={labels.descriptionPlaceholder}
              rows={3}
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
