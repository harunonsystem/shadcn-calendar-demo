# Storybook コンポーネント管理ガイドライン

このドキュメントでは、Storybookを使用したコンポーネント開発・管理のベストプラクティスを定義します。

---

## 1. ディレクトリ構成

### 1.1 コンポーネントごとのフォルダ構成（推奨）

**根拠**: [Colocation Best Practice](https://kentcdodds.com/blog/colocation) - 関連ファイルを近くに配置することで保守性が向上

```
src/components/
├── calendar/
│   ├── add-event-modal/
│   │   ├── index.tsx           # メインコンポーネント
│   │   ├── add-event-modal.stories.tsx
│   │   └── add-event-modal.test.tsx
│   ├── event-popover/
│   │   ├── index.tsx
│   │   ├── event-popover.stories.tsx
│   │   └── event-popover.test.tsx
│   └── time-grid-event/
│       ├── index.tsx
│       ├── time-grid-event.stories.tsx
│       └── time-grid-event.test.tsx
├── datepicker/
│   └── datetime-picker/
│       ├── index.tsx
│       └── datetime-picker.stories.tsx
└── ui/
    ├── button/
    │   ├── index.tsx
    │   └── button.stories.tsx
    └── input/
        ├── index.tsx
        └── input.stories.tsx
```

### 1.2 メリット
- **コロケーション**: コンポーネント・Stories・テストが同じ場所にあり見つけやすい
- **モジュール性**: コンポーネントの移動・削除が容易
- **スケーラビリティ**: コンポーネント数が増えても管理しやすい
- **バレルエクスポート**: `index.tsx` により `import { Button } from '@/components/ui/button'` が可能

### 1.3 ファイル命名規則

| ファイル | 命名規則 | 例 |
|---------|---------|-----|
| コンポーネント | `index.tsx` | `button/index.tsx` |
| Stories | `{name}.stories.tsx` | `button/button.stories.tsx` |
| テスト | `{name}.test.tsx` | `button/button.test.tsx` |
| ユーティリティ | `{name}.utils.ts` | `button/button.utils.ts` |
| 型定義 | `{name}.types.ts` | `button/button.types.ts` |

---

## 2. Storybook カテゴリ構成

| カテゴリ | 説明 | 例 |
|---------|------|-----|
| `UI/` | 基本UIパーツ（shadcn/ui） | Button, Input, Card, Badge |
| `Calendar/` | カレンダー機能コンポーネント | TimeGridEvent, EventPopover, AddEventModal |
| `Datepicker/` | 日付選択関連 | DateTimePicker |

**命名規則:**
```typescript
const meta: Meta<typeof Component> = {
  title: 'カテゴリ/コンポーネント名',  // 例: 'Calendar/AddEventModal'
  // ...
}
```

---

## 3. Stories ファイルテンプレート

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { ComponentName } from './index'

// モックデータ定義
const mockData = { /* ... */ }

const meta: Meta<typeof ComponentName> = {
  // 1. 基本情報
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],

  // 2. パラメータ
  parameters: {
    layout: 'centered',  // or 'fullscreen', 'padded'
  },

  // 3. デフォルトargs
  args: {
    // 必須props
    // コールバック関数は fn() を使用
    onClick: fn(),
  },

  // 4. argTypes（コントロール定義）
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
  },

  // 5. デコレーター（必要な場合）
  decorators: [
    (Story: () => React.ReactNode) => (
      <div className="...">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ComponentName>

// Stories定義
/** 基本状態 */
export const Default: Story = {}

/** 状態バリエーション */
export const Loading: Story = {
  args: { isLoading: true },
}

/** 言語切り替え */
export const Japanese: Story = {
  args: { language: 'ja' },
}

export const English: Story = {
  args: { language: 'en' },
}
```

---

## 4. 必須Stories

各コンポーネントタイプごとに必ず用意するStory:

### 4.1 UIコンポーネント（Button, Inputなど）
- `Default` - デフォルト状態
- `AllVariants` - 全バリアント一覧（render関数使用）
- `AllSizes` - 全サイズ一覧
- `Disabled` - 無効状態
- `WithIcon` - アイコン付き（該当する場合）

### 4.2 モーダル/ダイアログ
- `Default` or `Japanese` - 日本語表示
- `English` - 英語表示
- `Empty` - 空の状態
- `Filled` - 入力済み状態
- `Error` - エラー状態（該当する場合）

### 4.3 イベント表示系
- `Default` - 基本状態
- `Short` / `Long` - 時間の長短
- `AllDay` - 終日イベント
- `CategoryColors` - カテゴリ別色分け

### 4.4 インタラクティブコンポーネント
- `Default` - 通常状態
- `Dragging` - ドラッグ中
- `Resizing` - リサイズ中
- `Selected` - 選択状態

---

## 5. i18n（国際化）対応

多言語対応コンポーネントでは、必ず日本語/英語のStoriesを用意:

```typescript
/** 日本語表示 */
export const Japanese: Story = {
  args: { language: 'ja' },
}

/** 英語表示 */
export const English: Story = {
  args: { language: 'en' },
}
```

---

## 6. モックデータ

### 6.1 イベントデータ
```typescript
const mockEvent: CalendarEvent = {
  id: '1',
  title: 'ミーティング',
  description: '週次定例',
  startDate: new Date(2026, 0, 2, 10, 0),  // 固定日付を使用
  endDate: new Date(2026, 0, 2, 11, 0),
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}
```

### 6.2 カテゴリデータ
```typescript
const mockCategories: CategoryColor[] = [
  { category: 'work', label: '仕事', backgroundColor: '#3b82f6', borderColor: '#2563eb' },
  { category: 'personal', label: 'プライベート', backgroundColor: '#22c55e', borderColor: '#16a34a' },
  { category: 'meeting', label: 'ミーティング', backgroundColor: '#f59e0b', borderColor: '#d97706' },
]
```

---

## 7. デコレーター

### 7.1 position: relative が必要な場合
```typescript
decorators: [
  (Story: () => React.ReactNode) => (
    <div style={{ position: 'relative', width: '200px', height: '400px' }}>
      <Story />
    </div>
  ),
],
```

### 7.2 フルスクリーン表示（モーダル等）
```typescript
parameters: {
  layout: 'fullscreen',
},
decorators: [
  (Story: () => React.ReactNode) => (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
      <Story />
    </div>
  ),
],
```

---

## 8. コンポーネント対応一覧

### UI コンポーネント
| コンポーネント | Stories | リファクタ |
|--------------|---------|-----------|
| Button | ✅ | ✅ |
| Input | ✅ | ✅ |
| Card | ✅ | ✅ |
| Badge | ✅ | ✅ |
| Label | ⬜ | ✅ |
| Textarea | ✅ | ✅ |
| Select | ✅ | ✅ |
| Popover | ⬜ | ✅ |
| Calendar (UI) | ⬜ | ✅ |

### Calendar コンポーネント
| コンポーネント | Stories | リファクタ |
|--------------|---------|-----------|
| TimeGridEvent | ✅ | ✅ |
| EventPopover | ✅ | ✅ |
| AddEventModal | ✅ | ✅ |
| EventDetailModal | ✅ | ✅ |
| EventMoveModal | ✅ | ✅ |
| EventResizeModal | ✅ | ✅ |
| EventConfirmModal | ⬜ (内部用) | ✅ |
| EventCategoryChangeModal | ✅ | ✅ |
| CategorySelect | ✅ | ✅ |
| NowIndicator | ⬜ | ✅ |
| CalendarHeader | ⬜ | ✅ |
| TimeGrid | ⬜ | ✅ |
| DayView | ⬜ | ✅ |
| WeekView | ⬜ | ✅ |
| MonthView | ⬜ | ✅ |
| CategoryView | ⬜ | ✅ |
| AllDayRow | ⬜ | ✅ |
| Calendar (メイン) | ⬜ | ✅ |

### Datepicker コンポーネント
| コンポーネント | Stories | リファクタ |
|--------------|---------|-----------|
| DateTimePicker | ✅ | ✅ |

---

## 9. 新規コンポーネント作成チェックリスト

- [ ] コンポーネントフォルダを作成 (`component-name/`)
- [ ] `index.tsx` にコンポーネントを実装
- [ ] `{name}.stories.tsx` を作成
- [ ] `title` は適切なカテゴリに設定
- [ ] `tags: ['autodocs']` を設定
- [ ] 必須Storiesを全て作成
- [ ] i18n対応の場合は日英両方のStoriesを作成
- [ ] `bun run storybook` で表示確認
- [ ] `bun run ci` でテスト通過確認

---

## 10. 参考資料

- [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocation)
- [Storybook - Naming components and hierarchy](https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
