import type { Language } from '@/types/calendar'

/**
 * カレンダー全体の翻訳定義
 * コンポーネント内での language === 'ja' のようなハードコードは禁止
 * すべての翻訳はここで定義し、getTranslation() で取得すること
 */
export const translations = {
  ja: {
    // 月名
    monthNames: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    // 曜日（月曜始まり）
    weekDays: ['月', '火', '水', '木', '金', '土', '日'],
    // 曜日（日曜始まり - 標準配列）
    weekDaysFull: ['日', '月', '火', '水', '木', '金', '土'],
    // ビューモード
    viewModes: {
      month: '月',
      week: '週',
      day: '日',
      category: 'カテゴリ',
    },
    // 共通
    today: '今日',
    more: '件',
    addEvent: 'イベント追加',
    noEvents: 'イベントがありません',
    allDay: '終日',
    noEventsWithCategory: 'カテゴリが設定されたイベントがありません',
    // イベント作成モーダル
    addEventModal: {
      title: '新規イベント',
      eventTitle: 'タイトル',
      eventTitlePlaceholder: 'イベント名を入力',
      allDay: '終日',
      startDate: '開始日',
      endDate: '終了日',
      startTime: '開始日時',
      endTime: '終了日時',
      description: '説明',
      descriptionPlaceholder: '説明を入力（任意）',
      category: 'カテゴリ',
      categoryPlaceholder: 'カテゴリ名（任意）',
      create: '作成',
      cancel: 'キャンセル',
    },
    // イベントポップオーバー
    eventPopover: {
      edit: '編集',
      delete: '削除',
      moreDetails: '詳細',
    },
    // イベント移動/リサイズモーダル
    eventModal: {
      moveTitle: 'イベントを移動',
      resizeTitle: 'イベントの時間変更',
      from: '変更前',
      to: '変更後',
      confirm: '確定',
      cancel: 'キャンセル',
    },
    // DateTimePicker
    datePicker: {
      cancel: 'キャンセル',
      apply: '適用',
    },
    // ロケール情報
    locale: 'ja-JP',
    dateFnsLocaleKey: 'ja',
    // フォーマットパターン
    formats: {
      monthYear: '{year}年 {month}',
      dateOptions: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' } as const,
    },
    // 単位
    units: {
      minutes: '分',
      hours: '時間',
    },
  },
  en: {
    monthNames: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekDaysFull: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    viewModes: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      category: 'Category',
    },
    today: 'Today',
    more: 'more',
    addEvent: 'Add Event',
    noEvents: 'No events',
    allDay: 'All day',
    noEventsWithCategory: 'No events with categories',
    addEventModal: {
      title: 'New Event',
      eventTitle: 'Title',
      eventTitlePlaceholder: 'Enter event name',
      allDay: 'All Day',
      startDate: 'Start Date',
      endDate: 'End Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      description: 'Description',
      descriptionPlaceholder: 'Enter description (optional)',
      category: 'Category',
      categoryPlaceholder: 'Category name (optional)',
      create: 'Create',
      cancel: 'Cancel',
    },
    eventPopover: {
      edit: 'Edit',
      delete: 'Delete',
      moreDetails: 'More details',
    },
    eventModal: {
      moveTitle: 'Move Event',
      resizeTitle: 'Resize Event',
      from: 'From',
      to: 'To',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    datePicker: {
      cancel: 'Cancel',
      apply: 'Apply',
    },
    // ロケール情報
    locale: 'en-US',
    dateFnsLocaleKey: 'enUS',
    // フォーマットパターン
    formats: {
      monthYear: '{month} {year}',
      dateOptions: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' } as const,
    },
    // 単位
    units: {
      minutes: 'm',
      hours: 'h',
    },
  },
} as const

// 翻訳の型（jaとenで共通の構造）
export type Translations = {
  readonly monthNames: readonly string[]
  readonly weekDays: readonly string[]
  readonly weekDaysFull: readonly string[]
  readonly viewModes: {
    readonly month: string
    readonly week: string
    readonly day: string
    readonly category: string
  }
  readonly today: string
  readonly more: string
  readonly addEvent: string
  readonly noEvents: string
  readonly allDay: string
  readonly noEventsWithCategory: string
  readonly addEventModal: {
    readonly title: string
    readonly eventTitle: string
    readonly eventTitlePlaceholder: string
    readonly allDay: string
    readonly startDate: string
    readonly endDate: string
    readonly startTime: string
    readonly endTime: string
    readonly description: string
    readonly descriptionPlaceholder: string
    readonly category: string
    readonly categoryPlaceholder: string
    readonly create: string
    readonly cancel: string
  }
  readonly eventPopover: {
    readonly edit: string
    readonly delete: string
    readonly moreDetails: string
  }
  readonly eventModal: {
    readonly moveTitle: string
    readonly resizeTitle: string
    readonly from: string
    readonly to: string
    readonly confirm: string
    readonly cancel: string
  }
  readonly datePicker: {
    readonly cancel: string
    readonly apply: string
  }
  readonly locale: string
  readonly dateFnsLocaleKey: string
  readonly formats: {
    readonly monthYear: string
    readonly dateOptions: Intl.DateTimeFormatOptions
  }
  readonly units: {
    readonly minutes: string
    readonly hours: string
  }
}

/**
 * 指定言語の翻訳を取得
 */
export const getTranslation = (language: Language): Translations => {
  return translations[language] as Translations
}

/**
 * 曜日名を取得（日曜=0）
 */
export const getWeekDayName = (language: Language, dayIndex: number): string => {
  return translations[language].weekDaysFull[dayIndex]
}

/**
 * firstDayOfWeekに基づいて曜日ラベルをローテーション
 */
export const getWeekDayLabels = (language: Language, firstDayOfWeek: number = 0): string[] => {
  const fullWeekDays = translations[language].weekDaysFull
  return [...fullWeekDays.slice(firstDayOfWeek), ...fullWeekDays.slice(0, firstDayOfWeek)]
}
