import { describe, it, expect } from 'vitest'
import {
  formatTime,
  formatTimeRange,
  calculateDuration,
  calculateEventPosition,
  minutesToTimeString,
  timeStringToMinutes,
  getCurrentTimeInMinutes,
  getEventDisplayInfo,
  eventsOverlap,
  groupOverlappingEvents,
  calculateOverlapLayout,
} from '@/lib/utils/time'
import { CalendarEvent } from '@/types/calendar'

// テスト用イベント作成ヘルパー
const createEvent = (
  id: string,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): CalendarEvent => ({
  id,
  title: `Event ${id}`,
  startDate: new Date(2025, 0, 1, startHour, startMinute),
  endDate: new Date(2025, 0, 1, endHour, endMinute),
})

describe('utils/time', () => {
  describe('formatTime', () => {
    it('時間を24時間形式でフォーマットする', () => {
      const date = new Date(2025, 0, 1, 9, 30)
      expect(formatTime(date)).toBe('09:30')
    })

    it('午後の時間も24時間形式でフォーマットする', () => {
      const date = new Date(2025, 0, 1, 14, 5)
      expect(formatTime(date)).toBe('14:05')
    })
  })

  describe('formatTimeRange', () => {
    it('開始時間と終了時間を範囲形式で表示する', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 10, 30)
      expect(formatTimeRange(start, end)).toBe('09:00 - 10:30')
    })
  })

  describe('calculateDuration', () => {
    it('日本語で継続時間を計算する（時間と分）', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 10, 30)
      expect(calculateDuration(start, end, 'ja')).toBe('1時間30分')
    })

    it('日本語で継続時間を計算する（時間のみ）', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 11, 0)
      expect(calculateDuration(start, end, 'ja')).toBe('2時間')
    })

    it('日本語で継続時間を計算する（分のみ）', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 9, 45)
      expect(calculateDuration(start, end, 'ja')).toBe('45分')
    })

    it('英語で継続時間を計算する', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 10, 30)
      expect(calculateDuration(start, end, 'en')).toBe('1h30m')
    })

    it('日本語で日数を含む継続時間を計算する', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 3, 10, 30) // 2日1時間30分後
      expect(calculateDuration(start, end, 'ja')).toBe('2日1時間30分')
    })

    it('英語で日数を含む継続時間を計算する', () => {
      const start = new Date(2025, 0, 1, 0, 0)
      const end = new Date(2025, 0, 2, 0, 0) // ちょうど1日
      expect(calculateDuration(start, end, 'en')).toBe('1d')
    })

    it('0分の場合は0分を返す', () => {
      const start = new Date(2025, 0, 1, 9, 0)
      const end = new Date(2025, 0, 1, 9, 0) // 同じ時刻
      expect(calculateDuration(start, end, 'ja')).toBe('0分')
    })
  })

  describe('calculateEventPosition', () => {
    it('イベントの位置と高さを計算する', () => {
      const event = createEvent('1', 9, 0, 10, 0)
      const position = calculateEventPosition(event)

      // 9:00 = 540分 → top = (540/30)*24 = 432
      expect(position.top).toBe(432)
      // 1時間 = 60分 → height = (60/30)*24 = 48
      expect(position.height).toBe(48)
    })

    it('最小高さ24pxを適用する', () => {
      const event = createEvent('1', 9, 0, 9, 15)
      const position = calculateEventPosition(event)

      // 15分は本来18pxだが、最小24pxが適用される
      expect(position.height).toBe(24)
    })
  })

  describe('minutesToTimeString', () => {
    it('分を時刻文字列に変換する', () => {
      expect(minutesToTimeString(540)).toBe('09:00')
      expect(minutesToTimeString(630)).toBe('10:30')
      expect(minutesToTimeString(0)).toBe('00:00')
      expect(minutesToTimeString(1439)).toBe('23:59')
    })
  })

  describe('timeStringToMinutes', () => {
    it('時刻文字列を分に変換する', () => {
      expect(timeStringToMinutes('09:00')).toBe(540)
      expect(timeStringToMinutes('10:30')).toBe(630)
      expect(timeStringToMinutes('00:00')).toBe(0)
      expect(timeStringToMinutes('23:59')).toBe(1439)
    })
  })

  describe('getCurrentTimeInMinutes', () => {
    it('現在時刻を分単位で返す', () => {
      const result = getCurrentTimeInMinutes()
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(24 * 60)
    })
  })

  describe('getEventDisplayInfo', () => {
    it('高さに応じた表示フラグを返す', () => {
      expect(getEventDisplayInfo(20)).toEqual({
        showTitle: false,
        showTime: false,
        showDescription: false,
        canShowFullDetails: false,
      })

      expect(getEventDisplayInfo(48)).toEqual({
        showTitle: true,
        showTime: true,
        showDescription: false,
        canShowFullDetails: false,
      })

      expect(getEventDisplayInfo(100)).toEqual({
        showTitle: true,
        showTime: true,
        showDescription: true,
        canShowFullDetails: true,
      })
    })
  })

  describe('eventsOverlap', () => {
    it('重複するイベントを検出する', () => {
      const event1 = createEvent('1', 9, 0, 10, 30)
      const event2 = createEvent('2', 10, 0, 11, 0)
      expect(eventsOverlap(event1, event2)).toBe(true)
    })

    it('重複しないイベントを検出する', () => {
      const event1 = createEvent('1', 9, 0, 10, 0)
      const event2 = createEvent('2', 10, 30, 11, 0)
      expect(eventsOverlap(event1, event2)).toBe(false)
    })

    it('隣接するイベント（終了=開始）は重複しない', () => {
      const event1 = createEvent('1', 9, 0, 10, 0)
      const event2 = createEvent('2', 10, 0, 11, 0)
      expect(eventsOverlap(event1, event2)).toBe(false)
    })
  })

  describe('groupOverlappingEvents', () => {
    it('重複するイベントをグループ化する', () => {
      const events = [
        createEvent('1', 9, 0, 10, 0),
        createEvent('2', 9, 30, 10, 30),
        createEvent('3', 11, 0, 12, 0),
      ]
      const groups = groupOverlappingEvents(events)

      expect(groups.length).toBe(2)
      expect(groups[0].length).toBe(2) // 重複グループ
      expect(groups[1].length).toBe(1) // 独立イベント
    })
  })

  describe('calculateOverlapLayout', () => {
    it('単一イベントは100%幅', () => {
      const events = [createEvent('1', 9, 0, 10, 0)]
      const layouts = calculateOverlapLayout(events)

      expect(layouts[0].width).toBe(100)
      expect(layouts[0].left).toBe(0)
    })

    it('カラムモードで重複イベントを均等分割', () => {
      const events = [createEvent('1', 9, 0, 10, 0), createEvent('2', 9, 0, 10, 0)]
      const layouts = calculateOverlapLayout(events, 'column')

      expect(layouts.length).toBe(2)
      expect(layouts[0].width).toBe(48) // 50 - 2
      expect(layouts[1].left).toBe(50)
    })

    it('スタックモードで重複イベントをオフセット', () => {
      const events = [createEvent('1', 9, 0, 10, 0), createEvent('2', 9, 0, 10, 0)]
      const layouts = calculateOverlapLayout(events, 'stack')

      expect(layouts[0].width).toBe(85)
      expect(layouts[0].left).toBe(0)
      expect(layouts[1].left).toBe(5)
    })
  })
})
