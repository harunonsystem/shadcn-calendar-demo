/**
 * 時間関連の定数
 */
export const MS_PER_DAY = 86400000
export const MS_PER_HOUR = 3600000
export const MS_PER_MINUTE = 60000
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24

/**
 * タイムグリッド表示設定
 */
export const TIME_SLOT_HEIGHT_PX = 24
export const TIME_SLOT_INTERVAL_MINUTES = 30
export const MIN_EVENT_HEIGHT_PX = 24

/**
 * ドラッグ&ドロップ設定
 */
export const DRAG_THRESHOLD_PX = 5
export const CLICK_VS_DRAG_TIME_MS = 300

/**
 * オーバーラップレイアウト設定
 */
export const STACK_MODE_WIDTH_PERCENT = 85
export const STACK_MODE_OFFSET_PERCENT = 5
export const COLUMN_MODE_GAP_PERCENT = 2

/**
 * 表示情報の閾値（イベントの高さに応じた表示切り替え）
 */
export const EVENT_DISPLAY_THRESHOLDS = {
  showTitle: 24,
  showTime: 48,
  showDescription: 72,
  showFullDetails: 96,
} as const

/**
 * リサイズハンドルの閾値
 */
export const RESIZE_HANDLE_MIN_HEIGHT_PX = 30
