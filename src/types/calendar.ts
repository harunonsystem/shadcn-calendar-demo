import type { Language } from '@/lib/i18n'

export type ViewMode = 'month' | 'week' | 'day' | 'category'

// Language型は@/lib/i18n/config.tsで定義され、ここで再エクスポート
export type { Language } from '@/lib/i18n'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  allDay?: boolean // 終日イベント
  color?: string
  backgroundColor?: string
  borderColor?: string
  category?: string
}

// カテゴリ別の色設定
export interface CategoryColor {
  category?: string // カテゴリキー（labelと同じ場合は省略可能）
  label: string // カテゴリ名（表示用）
  borderColor: string // 枠線の色
  backgroundColor: string // 背景色
}

export interface CalendarConfig {
  showNowIndicator?: boolean
  nowIndicatorColor?: string // Now Indicatorの色
  language?: Language
  defaultView?: ViewMode
  enableDragDrop?: boolean
  enableResize?: boolean
  eventStackMode?: 'stack' | 'column'
  quickResize?: boolean // true: 即座に延長, false: modal確認
  quickDragDrop?: boolean // true: 即座に移動, false: modal確認
  // FullCalendar: firstDay, Vuetify: firstDayOfWeek を参考
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (default: 0)
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  // カテゴリ別の色設定
  categoryColors?: CategoryColor[]
}

export interface EventDragState {
  isDragging: boolean
  draggedEvent: CalendarEvent | null
  dragOffset: { x: number; y: number }
  originalDate: Date
}

export interface EventResizeState {
  isResizing: boolean
  resizedEvent: CalendarEvent | null
  resizeHandle: 'top' | 'bottom' | null
  originalHeight: number
}
