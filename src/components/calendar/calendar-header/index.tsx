import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Plus, List } from 'lucide-react'
import { ViewMode, Language } from '@/types/calendar'
import { getTitle } from '../calendar-utils'
import { getTranslation } from '@/lib/i18n'

interface CalendarHeaderProps {
  viewMode: ViewMode
  language: Language
  currentDate: Date
  onViewModeChange: (mode: ViewMode) => void
  onLanguageChange: (lang: Language) => void
  onNavigate: (direction: 'prev' | 'next') => void
  onTodayClick: () => void
  onCreateEvent?: () => void
}

export function CalendarHeader({
  viewMode,
  language,
  currentDate,
  onViewModeChange,
  onLanguageChange,
  onNavigate,
  onTodayClick,
  onCreateEvent,
}: CalendarHeaderProps) {
  const t = getTranslation(language)

  return (
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation and Today button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTodayClick}
            className="px-4 py-2 font-medium"
          >
            {t.today}
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('prev')} className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('next')} className="p-2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl font-semibold ml-4">
            {getTitle(viewMode, currentDate, language)}
          </CardTitle>
        </div>

        {/* Right side - View modes and actions */}
        <div className="flex items-center gap-2">
          {/* View mode buttons */}
          <div className="flex items-center border rounded-md">
            {(['month', 'week', 'day'] as ViewMode[]).map((mode, index) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className={`
                  px-3 py-1 text-sm font-medium rounded-none
                  ${index === 0 ? 'rounded-l-md' : ''}
                  ${index === 2 ? 'rounded-r-md' : ''}
                  ${viewMode === mode ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                `}
              >
                {t.viewModes[mode]}
              </Button>
            ))}
          </div>

          {/* Category view button */}
          <Button
            variant={viewMode === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('category')}
            className="px-3 py-1"
          >
            <List className="h-4 w-4 mr-1" />
            {t.viewModes.category}
          </Button>

          {/* Language toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(language === 'ja' ? 'en' : 'ja')}
            className="px-3 py-1"
          >
            {language === 'ja' ? 'EN' : 'JP'}
          </Button>

          {/* Add event button */}
          <Button onClick={onCreateEvent} size="sm" className="px-4 py-2 ml-2">
            <Plus className="h-4 w-4 mr-2" />
            {t.addEvent}
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}
