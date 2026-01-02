/**
 * 言語設定
 *
 * 新しい言語を追加する手順:
 * 1. supportedLanguages に言語コードを追加
 * 2. translations.ts に翻訳を追加
 *
 * デフォルト言語を変更する場合:
 * 1. defaultLanguage を変更するだけ
 */

// サポートする言語の定義
export const supportedLanguages = ['ja', 'en'] as const

// 言語型（supportedLanguagesから自動導出）
export type Language = (typeof supportedLanguages)[number]

// デフォルト言語
export const defaultLanguage: Language = 'ja'

// 言語が有効かチェック
export const isValidLanguage = (lang: unknown): lang is Language => {
  return typeof lang === 'string' && supportedLanguages.includes(lang as Language)
}
