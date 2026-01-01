import { CalendarConfig } from '@/types/calendar'
import { isSameDay } from '@/lib/utils/date'

interface NowIndicatorProps {
  date: Date
  position: number
  config: CalendarConfig
}

/**
 * 現在時刻を示すインジケーター
 * 今日の列にのみ表示される赤い線
 */
export function NowIndicator({ date, position, config }: NowIndicatorProps) {
  if (!config.showNowIndicator || !isSameDay(date, new Date())) {
    return null
  }

  const color = config.nowIndicatorColor || '#ef4444'

  return (
    <div
      className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
      style={{ top: position }}
    >
      {/* 丸い点 */}
      <div
        className="w-2.5 h-2.5 rounded-full -ml-1"
        style={{ backgroundColor: color }}
      />
      {/* 線 */}
      <div
        className="flex-1 h-0.5"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
