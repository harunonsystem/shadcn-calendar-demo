# AGENTS.md - Shadcn Calendar Demo

## 概要

React 19 + Jotai + nuqsを用いたカレンダーアプリケーション。
Googleカレンダー風のUIを備え、月/週/日/カテゴリビューをサポート。

---

## アーキテクチャ

```
src/
├── lib/
│   ├── atoms/          # Jotai atoms（状態管理）
│   │   ├── calendar-atoms.ts   # 日付・イベント・設定
│   │   ├── selection-atoms.ts  # 選択中のイベント
│   │   ├── interaction-atoms.ts # ドラッグ・リサイズ状態
│   │   └── ui-atoms.ts         # モーダル・ポップオーバー
│   ├── hooks/          # カスタムhooks
│   │   ├── use-calendar.ts     # カレンダー状態操作
│   │   ├── use-events.ts       # イベントCRUD
│   │   ├── use-interaction.ts  # ドラッグ&リサイズ
│   │   └── use-view-mode.ts    # ビュー切替
│   ├── utils/          # 純粋関数ユーティリティ
│   │   ├── date.ts     # 日付操作
│   │   ├── time.ts     # 時間計算・フォーマット
│   │   └── event.ts    # イベントフィルタリング
│   └── constants.ts    # 定数定義
├── components/
│   ├── calendar/       # カレンダーコンポーネント
│   ├── datepicker/     # DateTimePicker
│   └── ui/             # shadcn/uiコンポーネント
└── types/              # TypeScript型定義
```

---

## 状態管理

### Jotai Atoms

| カテゴリ | Atom | 用途 |
|---------|-------|------|
| calendar | `currentDateAtom` | 表示中の日付 |
| calendar | `eventsAtom` | イベントリスト |
| calendar | `configAtom` | カレンダー設定 |
| selection | `selectedEventAtom` | 選択中のイベント |
| interaction | `dragStateAtom` | ドラッグ状態 |
| interaction | `resizeStateAtom` | リサイズ状態 |
| ui | `popoverStateAtom` | ポップオーバー表示 |

### nuqs（URL状態同期）

```typescript
// ビューモードと言語がURLに同期
const [viewMode, setViewMode] = useQueryState('type', viewModeParser)
const [language, setLanguage] = useQueryState('lang', languageParser)
```

**URL例**: `/?type=week&lang=en`

---

## コーディング規約

### 1. コンポーネント設計

```typescript
// ✅ Good: propsはオプショナル、atomsからフォールバック
export function DayView({
  currentDate: propCurrentDate,
  events: propEvents,
  config: propConfig,
  language,
}: DayViewProps) {
  const atomCurrentDate = useAtomValue(currentDateAtom)
  const currentDate = propCurrentDate ?? atomCurrentDate
}
```

### 2. ファイルインポート

```typescript
// ✅ Good: @エイリアス使用、カテゴリ別インポート
import { getWeekDays, isSameDay } from '@/lib/utils/date'
import { getEventsForDate } from '@/lib/utils/event'
import { currentDateAtom } from '@/lib/atoms'

// ❌ Bad: 相対パス多用
import { ... } from '../../../lib/date-utils'
```

### 3. 状態の粒度

```typescript
// ✅ Good: 責務別にatomを分割
export const dragStateAtom = atom<EventDragState>({...})
export const resizeStateAtom = atom<EventResizeState>({...})

// ❌ Bad: 巨大な単一atom
export const appStateAtom = atom({ drag: {...}, resize: {...}, ui: {...} })
```

### 4. 純粋関数の配置

```typescript
// @/lib/utils/ に配置、副作用なし
export const getEventsForDate = (events: CalendarEvent[], date: Date) => {
  return events.filter(e => isSameDay(new Date(e.startDate), date))
}
```

---

## 設定オプション

### CalendarConfig

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|---------|------|
| `firstDayOfWeek` | `0-6` | `0` | 週の開始曜日（0=日曜） |
| `language` | `'ja'｜'en'` | `'ja'` | 言語 |
| `showNowIndicator` | `boolean` | `true` | 現在時刻線の表示 |
| `categoryColors` | `CategoryColor[]` | - | カテゴリ別色設定 |
| `quickDragDrop` | `boolean` | `false` | 確認なしドロップ |
| `quickResize` | `boolean` | `false` | 確認なしリサイズ |

---

## UI/UX ガイドライン

### キーボード操作
- **Escape**: すべてのモーダル・ポップオーバーを閉じる

### ポップオーバー位置
- 右端に収まらない場合は左側に表示

### ドラッグ/リサイズ
- 操作開始時にポップオーバーは自動で閉じる

---

## テスト

```bash
# 単体テスト
bun run test

# 型チェック
bun run tsc
```

### テストファイル配置
- `src/lib/utils/*.test.ts` - ユーティリティ関数のテスト

---

## 依存関係

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| react | ^19.0.0 | UIフレームワーク |
| jotai | ^2.12.3 | 状態管理 |
| nuqs | ^2.8.6 | URL状態同期 |
| date-fns | ^4.1.0 | 日付操作 |
| react-day-picker | ^9.13.0 | カレンダーUI |
| lucide-react | - | アイコン |
