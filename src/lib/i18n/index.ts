import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { translations, type Translations } from './translations'
import { type Language, defaultLanguage } from './config'

// 言語設定のatom（URLやlocalStorageと同期可能）
export const languageAtom = atomWithStorage<Language>('calendar-language', defaultLanguage)

/**
 * 現在の言語設定に基づいて翻訳を取得するカスタムフック
 * コンポーネント内で language を props で受け取る必要がなくなる
 *
 * @example
 * const t = useTranslation()
 * return <div>{t.allDay}</div>
 */
export const useTranslation = (): Translations => {
  const language = useAtomValue(languageAtom)
  return translations[language] as Translations
}

/**
 * 言語を直接指定して翻訳を取得（非Reactコンテキスト用）
 */
export const getTranslation = (language: Language): Translations => {
  return translations[language] as Translations
}

// config.tsからの再エクスポート
export { supportedLanguages, defaultLanguage, isValidLanguage } from './config'
export type { Language } from './config'

// translations.tsからの再エクスポート
export { translations, getWeekDayName, getWeekDayLabels } from './translations'
export type { Translations } from './translations'
