import { CalendarEvent, Language, CategoryColor } from '@/types/calendar'
import { Tag, ArrowRight } from 'lucide-react'
import { EventConfirmModal } from '../event-confirm-modal'

interface EventCategoryChangeModalProps {
  event: CalendarEvent | null
  language: Language
  isOpen: boolean
  newCategory: string
  categoryColors?: CategoryColor[]
  onConfirm: () => void
  onCancel: () => void
}

export function EventCategoryChangeModal({
  event,
  language,
  isOpen,
  newCategory,
  categoryColors = [],
  onConfirm,
  onCancel,
}: EventCategoryChangeModalProps) {
  if (!event) return null

  const t = {
    ja: {
      confirmCategoryChange: 'カテゴリを変更',
      confirm: '変更する',
      cancel: 'キャンセル',
      noCategory: 'カテゴリなし',
    },
    en: {
      confirmCategoryChange: 'Change Category',
      confirm: 'Change',
      cancel: 'Cancel',
      noCategory: 'No Category',
    },
  }

  const labels = t[language]

  const oldCategory = event.category || labels.noCategory
  const displayNewCategory = newCategory || labels.noCategory

  // カテゴリの色を取得
  const getColorForCategory = (category: string) => {
    const colorConfig = categoryColors.find((c) => c.label === category)
    return colorConfig
      ? { backgroundColor: colorConfig.backgroundColor, borderColor: colorConfig.borderColor }
      : { backgroundColor: '#6b7280', borderColor: '#4b5563' }
  }

  const oldCategoryColor = getColorForCategory(oldCategory)
  const newCategoryColor = getColorForCategory(newCategory)

  return (
    <EventConfirmModal
      isOpen={isOpen}
      title={labels.confirmCategoryChange}
      event={event}
      categoryColors={categoryColors}
      confirmLabel={labels.confirm}
      cancelLabel={labels.cancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {/* Change Visualization */}
      <div className="flex items-center gap-3">
        {/* Old Category */}
        <div className="flex-1 p-4 rounded-lg bg-muted/50 border border-muted">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: oldCategoryColor.backgroundColor }}
              />
              <span className="text-sm text-muted-foreground">{oldCategory}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>

        {/* New Category */}
        <div className="flex-1 p-4 rounded-lg bg-primary/10 border-2 border-primary">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: newCategoryColor.backgroundColor }}
              />
              <span className="text-sm text-primary font-medium">{displayNewCategory}</span>
            </div>
          </div>
        </div>
      </div>
    </EventConfirmModal>
  )
}
