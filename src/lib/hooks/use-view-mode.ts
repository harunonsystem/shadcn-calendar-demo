import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { ViewMode, Language } from '@/types/calendar'

const viewModeParser = parseAsStringLiteral(['month', 'week', 'day', 'category'] as const)
const languageParser = parseAsStringLiteral(['ja', 'en'] as const)

export const useViewMode = (defaultView: ViewMode = 'month', defaultLanguage: Language = 'ja') => {
  const [viewMode, setViewMode] = useQueryState('type', viewModeParser.withDefault(defaultView))
  const [language, setLanguage] = useQueryState('lang', languageParser.withDefault(defaultLanguage))

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  const toggleViewMode = () => {
    const modes: ViewMode[] = ['month', 'week', 'day', 'category']
    const currentIndex = modes.indexOf(viewMode as ViewMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setViewMode(modes[nextIndex])
  }

  return {
    viewMode: viewMode as ViewMode,
    language: language as Language,
    setViewMode: changeViewMode,
    setLanguage: changeLanguage,
    toggleViewMode,
  }
}
