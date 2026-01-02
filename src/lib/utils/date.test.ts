import { describe, it, expect } from 'vitest'
import { formatDate, getMonthDays, getWeekDays, isSameDay, isToday } from '@/lib/utils/date'

describe('utils/date', () => {
  describe('formatDate', () => {
    it('日付を日本語形式でフォーマットする', () => {
      const date = new Date(2025, 0, 15) // 2025年1月15日
      expect(formatDate(date)).toBe('2025/01/15')
    })
  })

  describe('getMonthDays', () => {
    it('指定した月の全日付を返す（31日の月）', () => {
      const days = getMonthDays(2025, 0) // 2025年1月
      expect(days.length).toBe(31)
      expect(days[0].getDate()).toBe(1)
      expect(days[30].getDate()).toBe(31)
    })

    it('指定した月の全日付を返す（28日の月）', () => {
      const days = getMonthDays(2025, 1) // 2025年2月（うるう年でない）
      expect(days.length).toBe(28)
    })

    it('うるう年の2月は29日', () => {
      const days = getMonthDays(2024, 1) // 2024年2月（うるう年）
      expect(days.length).toBe(29)
    })
  })

  describe('getWeekDays', () => {
    it('指定した日を含む週の7日間を返す', () => {
      const date = new Date(2025, 0, 15) // 2025年1月15日（水曜日）
      const weekDays = getWeekDays(date)

      expect(weekDays.length).toBe(7)
      // 月曜日から始まる
      expect(weekDays[0].getDate()).toBe(13) // 月曜
      expect(weekDays[6].getDate()).toBe(19) // 日曜
    })
  })

  describe('isSameDay', () => {
    it('同じ日付はtrueを返す', () => {
      const date1 = new Date(2025, 0, 15, 9, 0)
      const date2 = new Date(2025, 0, 15, 14, 30)
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('異なる日付はfalseを返す', () => {
      const date1 = new Date(2025, 0, 15)
      const date2 = new Date(2025, 0, 16)
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('年が異なるとfalseを返す', () => {
      const date1 = new Date(2025, 0, 15)
      const date2 = new Date(2024, 0, 15)
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })

  describe('isToday', () => {
    it('今日の日付はtrueを返す', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('昨日の日付はfalseを返す', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday)).toBe(false)
    })
  })
})
