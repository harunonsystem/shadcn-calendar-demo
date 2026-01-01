import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { ViewMode, Language } from '@/types/calendar'

export const viewModeAtom = atomWithStorage<ViewMode>('calendar-view-mode', 'month')
export const languageAtom = atomWithStorage<Language>('calendar-language', 'ja')
