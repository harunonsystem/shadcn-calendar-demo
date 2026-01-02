import { CategoryColor, Language } from '@/types/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTranslation } from '@/lib/i18n'

interface CategorySelectProps {
  value: string
  categories: CategoryColor[]
  language: Language
  onChange: (value: string) => void
  showLabel?: boolean
}

/**
 * カテゴリ選択コンポーネント
 * AddEventModal, EventDetailModal で共通使用
 */
export function CategorySelect({
  value,
  categories,
  language,
  onChange,
  showLabel = true,
}: CategorySelectProps) {
  const t = getTranslation(language)
  const labels = t.addEventModal

  // カテゴリキーを取得（categoryがあればそれを、なければlabelを使用）
  const getCategoryKey = (cat: CategoryColor) => cat.category || cat.label

  return (
    <div className="space-y-2">
      {showLabel && <Label>{labels.category}</Label>}
      {categories.length > 0 ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={labels.categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={getCategoryKey(cat)} value={getCategoryKey(cat)}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.backgroundColor }}
                  />
                  {cat.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={labels.categoryPlaceholder}
        />
      )}
    </div>
  )
}
