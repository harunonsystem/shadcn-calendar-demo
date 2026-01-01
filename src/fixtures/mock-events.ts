import { CalendarEvent } from '@/types/calendar'

/**
 * テスト・開発用のダミーイベントデータ
 */

// 基準日（今日）
const today = new Date()
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

/**
 * 日付ヘルパー関数
 */
export const createDate = (dayOffset: number, hours: number, minutes: number = 0): Date => {
  const date = new Date(todayStart)
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * カテゴリ別の色設定
 * 色はここで一元管理され、イベント表示時に自動適用される
 */
export const categoryColors = [
  {
    category: '仕事',
    label: '仕事',
    borderColor: '#1d4ed8',
    backgroundColor: '#3b82f6',
  },
  {
    category: 'プライベート',
    label: 'プライベート',
    borderColor: '#dc2626',
    backgroundColor: '#ef4444',
  },
  {
    category: '健康',
    label: '健康',
    borderColor: '#059669',
    backgroundColor: '#10b981',
  },
  {
    category: 'テスト',
    label: 'テスト',
    borderColor: '#6d28d9',
    backgroundColor: '#8b5cf6',
  },
]

/**
 * 仕事カテゴリのイベント
 * 色はcategoryColorsから自動取得されるため、個別設定不要
 */
export const workEvents: CalendarEvent[] = [
  {
    id: 'work-1',
    title: 'ミーティング',
    description: 'チームミーティング',
    startDate: createDate(0, 9, 0),
    endDate: createDate(0, 10, 30),
    category: '仕事',
  },
  {
    id: 'work-2',
    title: 'プロジェクト締切',
    description: 'プロジェクト締切',
    startDate: createDate(0, 14, 0),
    endDate: createDate(0, 15, 0),
    category: '仕事',
  },
  {
    id: 'work-3',
    title: '会議',
    description: '週次会議',
    startDate: createDate(2, 10, 0),
    endDate: createDate(2, 11, 30),
    category: '仕事',
  },
]

/**
 * プライベートカテゴリのイベント
 */
export const privateEvents: CalendarEvent[] = [
  {
    id: 'private-1',
    title:
      'ランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ',
    description:
      '友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ友達とランチ',
    startDate: createDate(1, 12, 0),
    endDate: createDate(1, 13, 0),
    category: 'プライベート',
  },
  {
    id: 'private-2',
    title: '映画鑑賞',
    description: '新作映画を見る',
    startDate: createDate(2, 19, 0),
    endDate: createDate(2, 21, 0),
    category: 'プライベート',
  },
]

/**
 * 健康カテゴリのイベント
 */
export const healthEvents: CalendarEvent[] = [
  {
    id: 'health-1',
    title: 'ジム',
    description: 'トレーニング',
    startDate: createDate(1, 18, 0),
    endDate: createDate(1, 19, 30),
    category: '健康',
  },
  {
    id: 'health-2',
    title: '朝のランニング',
    description: '健康管理',
    startDate: createDate(1, 6, 0),
    endDate: createDate(1, 7, 0),
    category: '健康',
  },
]

/**
 * 重複テスト用イベント
 */
export const overlappingEvents: CalendarEvent[] = [
  {
    id: 'overlap-1',
    title: 'オーバーラップイベント1',
    description: '重複テスト1',
    startDate: createDate(0, 9, 30),
    endDate: createDate(0, 11, 0),
    category: 'テスト',
  },
  {
    id: 'overlap-2',
    title: 'オーバーラップイベント2',
    description: '重複テスト2',
    startDate: createDate(0, 10, 0),
    endDate: createDate(0, 12, 0),
    category: 'テスト',
  },
]

/**
 * 終日イベント
 */
export const allDayEvents: CalendarEvent[] = [
  {
    id: 'allday-1',
    title: '祝日: 元旦',
    description: '新年',
    startDate: createDate(0, 0, 0),
    endDate: createDate(0, 23, 59),
    category: 'プライベート',
    allDay: true,
  },
  {
    id: 'allday-2',
    title: '出張',
    description: '東京出張',
    startDate: createDate(3, 0, 0),
    endDate: createDate(4, 23, 59),
    category: '仕事',
    allDay: true,
  },
  {
    id: 'allday-3',
    title: '休暇',
    description: '有給休暇',
    startDate: createDate(5, 0, 0),
    endDate: createDate(5, 23, 59),
    category: 'プライベート',
    allDay: true,
  },
]

/**
 * 全イベント（デフォルトエクスポート用）
 */
export const allMockEvents: CalendarEvent[] = [
  ...workEvents,
  ...privateEvents,
  ...healthEvents,
  ...overlappingEvents,
  ...allDayEvents,
]

export default allMockEvents
