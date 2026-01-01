import { useState, useEffect } from 'react'
import { format, type Locale } from 'date-fns'
import { ja, enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Language } from '@/types/calendar'
import { getTranslation } from '@/lib/i18n'

// date-fns locale マッピング（拡張可能）
const dateFnsLocales: Record<string, Locale> = {
  ja: ja,
  enUS: enUS,
}

export interface DateTimePickerLabels {
  cancel?: string
  apply?: string
}

export interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
  label?: string
  labels?: DateTimePickerLabels
  language?: Language
  // FullCalendar: firstDay, Vuetify: firstDayOfWeek を参考
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  // 時刻入力を非表示（終日イベント用）
  hideTime?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  className,
  label,
  labels,
  language = 'ja',
  weekStartsOn = 0,
  hideTime = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(value)
  const [timeValue, setTimeValue] = useState(
    `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`,
  )

  // Sync with external value changes
  useEffect(() => {
    setSelectedDate(value)
    setTimeValue(
      `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`,
    )
  }, [value])

  const t = getTranslation(language)
  const locale = dateFnsLocales[t.dateFnsLocaleKey] || enUS

  const defaultLabels = {
    cancel: t.datePicker.cancel,
    apply: t.datePicker.apply,
  }

  const currentLabels = { ...defaultLabels, ...labels }

  const formatDisplayDate = (date: Date) => {
    if (hideTime) {
      return format(date, 'yyyy/MM/dd', { locale })
    }
    return format(date, 'yyyy/MM/dd HH:mm', { locale })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // 時間を保持したまま日付を変更
      const newDate = new Date(date)
      const [hours, minutes] = timeValue.split(':').map(Number)
      newDate.setHours(hours || 0, minutes || 0, 0, 0)
      setSelectedDate(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value)
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const newDate = new Date(selectedDate)
    newDate.setHours(hours || 0, minutes || 0, 0, 0)
    setSelectedDate(newDate)
  }

  const handleApply = () => {
    onChange(selectedDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedDate(value)
    setTimeValue(
      `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`,
    )
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      {label && <Label className="mb-2 block">{label}</Label>}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {!hideTime && <Clock className="mr-2 h-4 w-4" />}
            {formatDisplayDate(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-4">
            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={locale}
              weekStartsOn={weekStartsOn}
              initialFocus
            />

            {/* Time Input */}
            {!hideTime && (
              <div className="flex items-center gap-2 border-t pt-3">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="flex-1"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 border-t pt-3">
              <Button variant="outline" size="sm" onClick={handleCancel} className="flex-1">
                {currentLabels.cancel}
              </Button>
              <Button size="sm" onClick={handleApply} className="flex-1">
                {currentLabels.apply}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
