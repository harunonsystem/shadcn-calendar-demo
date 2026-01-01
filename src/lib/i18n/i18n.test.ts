import { describe, it, expect } from 'vitest'
import {
  supportedLanguages,
  defaultLanguage,
  isValidLanguage,
  getTranslation,
  getWeekDayName,
  getWeekDayLabels,
  translations,
} from './index'

describe('i18n/config', () => {
  describe('supportedLanguages', () => {
    it('サポート言語配列が定義されている', () => {
      expect(supportedLanguages).toBeDefined()
      expect(supportedLanguages.length).toBeGreaterThan(0)
    })

    it('jaとenがサポートされている', () => {
      expect(supportedLanguages).toContain('ja')
      expect(supportedLanguages).toContain('en')
    })
  })

  describe('defaultLanguage', () => {
    it('デフォルト言語がサポート言語に含まれている', () => {
      expect(supportedLanguages).toContain(defaultLanguage)
    })
  })

  describe('isValidLanguage', () => {
    it('サポート言語でtrueを返す', () => {
      expect(isValidLanguage('ja')).toBe(true)
      expect(isValidLanguage('en')).toBe(true)
    })

    it('未サポート言語でfalseを返す', () => {
      expect(isValidLanguage('fr')).toBe(false)
      expect(isValidLanguage('de')).toBe(false)
    })

    it('不正な型でfalseを返す', () => {
      expect(isValidLanguage(null)).toBe(false)
      expect(isValidLanguage(undefined)).toBe(false)
      expect(isValidLanguage(123)).toBe(false)
      expect(isValidLanguage({})).toBe(false)
    })
  })
})

describe('i18n/translations', () => {
  describe('translations object', () => {
    it('すべてのサポート言語の翻訳が存在する', () => {
      for (const lang of supportedLanguages) {
        expect(translations[lang]).toBeDefined()
      }
    })

    it('必須キーがすべての言語に存在する', () => {
      const requiredKeys = ['today', 'allDay', 'addEvent', 'noEvents', 'locale']
      for (const lang of supportedLanguages) {
        const t = translations[lang]
        for (const key of requiredKeys) {
          expect(t).toHaveProperty(key)
        }
      }
    })
  })

  describe('getTranslation', () => {
    it('日本語翻訳を取得できる', () => {
      const t = getTranslation('ja')
      expect(t.today).toBe('今日')
      expect(t.allDay).toBe('終日')
      expect(t.locale).toBe('ja-JP')
    })

    it('英語翻訳を取得できる', () => {
      const t = getTranslation('en')
      expect(t.today).toBe('Today')
      expect(t.allDay).toBe('All day')
      expect(t.locale).toBe('en-US')
    })

    it('月名が12個存在する', () => {
      expect(getTranslation('ja').monthNames).toHaveLength(12)
      expect(getTranslation('en').monthNames).toHaveLength(12)
    })

    it('曜日が7個存在する', () => {
      expect(getTranslation('ja').weekDays).toHaveLength(7)
      expect(getTranslation('en').weekDays).toHaveLength(7)
      expect(getTranslation('ja').weekDaysFull).toHaveLength(7)
      expect(getTranslation('en').weekDaysFull).toHaveLength(7)
    })
  })

  describe('getWeekDayName', () => {
    it('日本語の曜日名を取得できる（日曜=0）', () => {
      expect(getWeekDayName('ja', 0)).toBe('日')
      expect(getWeekDayName('ja', 1)).toBe('月')
      expect(getWeekDayName('ja', 6)).toBe('土')
    })

    it('英語の曜日名を取得できる（Sunday=0）', () => {
      expect(getWeekDayName('en', 0)).toBe('Sun')
      expect(getWeekDayName('en', 1)).toBe('Mon')
      expect(getWeekDayName('en', 6)).toBe('Sat')
    })
  })

  describe('getWeekDayLabels', () => {
    it('日曜始まり（firstDayOfWeek=0）の曜日配列を返す', () => {
      const labels = getWeekDayLabels('ja', 0)
      expect(labels[0]).toBe('日')
      expect(labels[6]).toBe('土')
    })

    it('月曜始まり（firstDayOfWeek=1）の曜日配列を返す', () => {
      const labels = getWeekDayLabels('ja', 1)
      expect(labels[0]).toBe('月')
      expect(labels[6]).toBe('日')
    })

    it('英語でも正しくローテーションする', () => {
      const labelsSun = getWeekDayLabels('en', 0)
      expect(labelsSun[0]).toBe('Sun')

      const labelsMon = getWeekDayLabels('en', 1)
      expect(labelsMon[0]).toBe('Mon')
    })
  })

  describe('翻訳の一貫性', () => {
    it('すべての言語でaddEventModalのキーが一致する', () => {
      const jaKeys = Object.keys(getTranslation('ja').addEventModal)
      const enKeys = Object.keys(getTranslation('en').addEventModal)
      expect(jaKeys.sort()).toEqual(enKeys.sort())
    })

    it('すべての言語でviewModesのキーが一致する', () => {
      const jaKeys = Object.keys(getTranslation('ja').viewModes)
      const enKeys = Object.keys(getTranslation('en').viewModes)
      expect(jaKeys.sort()).toEqual(enKeys.sort())
    })

    it('すべての言語でunitsのキーが一致する', () => {
      const jaKeys = Object.keys(getTranslation('ja').units)
      const enKeys = Object.keys(getTranslation('en').units)
      expect(jaKeys.sort()).toEqual(enKeys.sort())
    })
  })
})
