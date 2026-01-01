import { CalendarEvent, CalendarConfig } from '@/types/calendar'
import { cn } from '@/lib/utils'
import { getEventStyle } from './calendar-utils'
import { getTimeGridEventInfo } from '@/lib/utils/time'

interface ResizePreview {
  top: number
  height: number
}

interface TimeGridEventProps {
  event: CalendarEvent
  config: CalendarConfig
  width: number
  left: number
  zIndex: number
  isDragging: boolean
  isResizing: boolean
  isDragStarted: boolean
  resizePreview?: ResizePreview | null
  onMouseDown: (e: React.MouseEvent, event: CalendarEvent, handle?: 'top' | 'bottom') => void
  onClick: (e: React.MouseEvent, event: CalendarEvent) => void
}

/**
 * タイムグリッド上のイベントカード
 */
export function TimeGridEvent({
  event,
  config,
  width,
  left,
  zIndex,
  isDragging,
  isResizing,
  isDragStarted,
  resizePreview,
  onMouseDown,
  onClick,
}: TimeGridEventProps) {
  const { position, displayInfo, timeRange } = getTimeGridEventInfo(event)

  // リサイズ中はプレビューの位置/高さを使用
  const displayTop = isResizing && resizePreview ? resizePreview.top : position.top
  const displayHeight = isResizing && resizePreview ? resizePreview.height : position.height

  return (
    <div
      className={cn(
        'absolute px-1 py-0.5 text-xs rounded cursor-move group transition-all hover:z-50 hover:shadow-lg',
        isDragging && 'opacity-50 shadow-lg border-2 border-blue-500',
        isResizing && 'opacity-60 shadow-md z-50',
      )}
      style={{
        top: displayTop,
        height: displayHeight,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: isDragging || isResizing ? 50 : zIndex + 10,
        ...getEventStyle(event, config),
      }}
      onMouseDown={(e) => onMouseDown(e, event)}
      onClick={(e) => {
        e.stopPropagation()
        if (!isDragging && !isResizing && !isDragStarted) {
          onClick(e, event)
        }
      }}
    >
      {/* Top resize handle */}
      {config.enableResize && displayHeight >= 30 && (
        <div
          className="absolute -top-1 left-0 right-0 h-3 cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={(e) => {
            e.stopPropagation()
            onMouseDown(e, event, 'top')
          }}
        />
      )}

      {displayInfo.showTitle && (
        <div className="font-semibold text-white truncate">{event.title}</div>
      )}
      {displayInfo.showTime && <div className="text-white/90 text-xs truncate">{timeRange}</div>}
      {displayInfo.showDescription && event.description && (
        <div className="text-white/80 text-xs truncate">{event.description}</div>
      )}

      {/* Bottom resize handle */}
      {config.enableResize && displayHeight >= 30 && (
        <div
          className="absolute -bottom-1 left-0 right-0 h-3 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={(e) => {
            e.stopPropagation()
            onMouseDown(e, event, 'bottom')
          }}
        />
      )}
    </div>
  )
}
