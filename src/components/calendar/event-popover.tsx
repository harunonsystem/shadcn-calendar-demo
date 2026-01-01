import { CalendarEvent, Language } from '@/types/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Clock, Calendar, MapPin, Trash2, Edit2 } from 'lucide-react'
import { minutesToTimeString } from '@/lib/utils/time'
import { getWeekDayName } from './calendar-utils'
import { useEffect, useRef, useState } from 'react'

// 定数
const MAX_TITLE_LENGTH = 30
const MAX_DESCRIPTION_LINES = 3
const POPOVER_WIDTH = 320
const POPOVER_HEIGHT = 280

interface EventPopoverProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
  onOpenDetail?: (event: CalendarEvent) => void
}

export function EventPopover({
  event,
  language,
  isOpen,
  position,
  onClose,
  onEdit,
  onDelete,
  onOpenDetail,
}: EventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ left: 0, top: 0 })

  // 位置調整
  useEffect(() => {
    if (!isOpen) return

    // ポップオーバーの位置を計算（画面外にはみ出さないように）
    const calculatePosition = () => {
      let left = position.x
      let top = position.y

      // 右端チェック - 右側に収まらない場合は左側に表示
      if (left + POPOVER_WIDTH > window.innerWidth - 16) {
        // 元のクリック位置からpopover幅分左に配置（イベント要素の左側）
        left = Math.max(16, position.x - POPOVER_WIDTH - 16)
      }

      // 下端チェック - 画面下に収まらない場合は上に表示
      if (top + POPOVER_HEIGHT > window.innerHeight - 16) {
        top = window.innerHeight - POPOVER_HEIGHT - 16
      }

      // 上端チェック
      if (top < 16) {
        top = 16
      }

      // 左端チェック（最終調整）
      if (left < 16) {
        left = 16
      }

      setAdjustedPosition({ left, top })
    }

    calculatePosition()
  }, [isOpen, position])

  // クリック外で閉じる
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // 少し遅延させてからリスナーを追加（イベントクリック直後に閉じないように）
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  const t = {
    ja: {
      edit: '編集',
      delete: '削除',
      moreDetails: '詳細を表示',
    },
    en: {
      edit: 'Edit',
      delete: 'Delete',
      moreDetails: 'More details',
    },
  }

  const labels = t[language]

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day} (${getWeekDayName(language, date.getDay())})`
  }

  // タイトルをトランケート
  const truncatedTitle =
    event.title.length > MAX_TITLE_LENGTH
      ? `${event.title.substring(0, MAX_TITLE_LENGTH)}...`
      : event.title

  return (
    <div
      ref={popoverRef}
      className="fixed z-50"
      style={{
        left: adjustedPosition.left,
        top: adjustedPosition.top,
        maxWidth: POPOVER_WIDTH,
      }}
    >
      <Card className="w-80 shadow-xl border max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header with event color */}
        <div
          className="px-4 py-3 rounded-t-lg flex items-start justify-between flex-shrink-0"
          style={{
            backgroundColor: event.backgroundColor || '#3b82f6',
          }}
        >
          <div className="flex-1 text-white min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate" title={event.title}>
              {truncatedTitle}
            </h3>
            {event.category && <span className="text-sm opacity-80">{event.category}</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 -mr-2 -mt-1 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>{formatDate(startDate)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>
              {minutesToTimeString(startMinutes)} - {minutesToTimeString(endMinutes)}
            </span>
          </div>

          {/* Description - 最大3行で切り詰め */}
          {event.description && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p
                className="text-muted-foreground"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: MAX_DESCRIPTION_LINES,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {event.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onEdit?.(event)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              {labels.edit}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
              onClick={() => onDelete?.(event)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {labels.delete}
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-xs ml-auto"
              onClick={() => onOpenDetail?.(event)}
            >
              {labels.moreDetails}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
