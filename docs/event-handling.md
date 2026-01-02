# イベントハンドリング アーキテクチャ

カレンダーコンポーネントにおけるイベント操作（ドラッグ＆ドロップ、リサイズ、クリック）の設計ドキュメント。

## 概要

```mermaid
graph TB
    subgraph "コンポーネント層"
        TG[TimeGrid]
        TGE[TimeGridEvent]
        ADR[AllDayRow]
        EP[EventPopover]
    end
    
    subgraph "フック層"
        UTI[useTimeGridInteraction]
    end
    
    subgraph "状態管理"
        DS[dragState]
        RS[resizeState]
        PS[popoverState]
        DP[dragPreview]
        RP[resizePreview]
    end
    
    TG --> UTI
    UTI --> DS
    UTI --> RS
    UTI --> PS
    UTI --> DP
    UTI --> RP
    
    TGE --> TG
    ADR --> TG
    EP --> TG
```

## 状態の種類

### 1. ドラッグ状態 (EventDragState)

```typescript
interface EventDragState {
  isDragging: boolean
  draggedEvent: CalendarEvent | null
  dragOffset: { x: number; y: number }
  originalDate: Date
}
```

### 2. リサイズ状態 (EventResizeState)

```typescript
interface EventResizeState {
  isResizing: boolean
  resizedEvent: CalendarEvent | null
  resizeHandle: 'top' | 'bottom' | null
  originalHeight: number
}
```

### 3. ポップオーバー状態 (PopoverState)

```typescript
interface PopoverState {
  isOpen: boolean
  event: CalendarEvent | null
  position: { x: number; y: number }
}
```

## イベントフロー

### ドラッグ操作

```mermaid
sequenceDiagram
    participant User
    participant TGE as TimeGridEvent
    participant Hook as useTimeGridInteraction
    participant State as 状態
    participant Modal as 確認モーダル

    User->>TGE: mouseDown (イベント本体)
    TGE->>Hook: handleMouseDown(event)
    Hook->>State: setDragState(準備中)
    Hook->>State: setPopoverState(閉じる)
    
    User->>Hook: mouseMove
    Hook->>State: isDragStarted = true
    Hook->>State: setDragPreview(プレビュー位置)
    
    User->>Hook: mouseUp
    
    alt quickDragDrop = true
        Hook->>Hook: onEventDrop直接呼び出し
    else quickDragDrop = false
        Hook->>State: setPendingDrag
        Hook->>State: setShowDragModal(true)
        Modal-->>User: 確認ダイアログ表示
        User->>Modal: 確認/キャンセル
        Modal->>Hook: handleDragConfirm/Cancel
    end
    
    Hook->>State: 状態リセット
```

### リサイズ操作

```mermaid
sequenceDiagram
    participant User
    participant TGE as TimeGridEvent
    participant Hook as useTimeGridInteraction
    participant State as 状態
    participant Modal as 確認モーダル

    User->>TGE: mouseDown (リサイズハンドル)
    TGE->>Hook: handleMouseDown(event, 'top' | 'bottom')
    Hook->>State: setResizeState開始
    Hook->>State: setPopoverState(閉じる)
    
    User->>Hook: mouseMove
    Hook->>State: setResizePreview(新しい高さ)
    
    User->>Hook: mouseUp
    
    alt quickResize = true
        Hook->>Hook: onEventResize直接呼び出し
    else quickResize = false
        Hook->>State: setPendingResize
        Hook->>State: setShowResizeModal(true)
        Modal-->>User: 確認ダイアログ表示
        User->>Modal: 確認/キャンセル
        Modal->>Hook: handleResizeConfirm/Cancel
    end
    
    Hook->>State: 状態リセット
```

### クリック操作（ポップオーバー）

```mermaid
sequenceDiagram
    participant User
    participant TGE as TimeGridEvent
    participant Hook as useTimeGridInteraction
    participant EP as EventPopover

    User->>TGE: click
    
    alt isDragging || isResizing || isInteracting()
        TGE->>TGE: クリック無視
    else 通常クリック
        TGE->>Hook: onClick
        Hook->>Hook: openPopover(event, position)
        Hook->>EP: ポップオーバー表示
    end
```

## コンポーネント構成

```mermaid
graph TD
    subgraph "TimeGrid"
        Header[ヘッダー]
        ADR[AllDayRow]
        Grid[時間グリッド]
        
        subgraph "Grid内部"
            TimeLabels[時刻ラベル]
            EventArea[イベントエリア]
            TGE1[TimeGridEvent 1]
            TGE2[TimeGridEvent 2]
        end
        
        Modals[確認モーダル群]
        Popover[EventPopover]
    end
    
    Grid --> TimeLabels
    Grid --> EventArea
    EventArea --> TGE1
    EventArea --> TGE2
```

## useTimeGridInteraction フック

### 入力

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `dates` | `Date[]` | 表示する日付配列 |
| `config` | `CalendarConfig` | カレンダー設定 |
| `gridRef` | `React.RefObject` | グリッドDOM参照 |
| `onEventDrop` | `function` | ドロップ時コールバック |
| `onEventResize` | `function` | リサイズ時コールバック |

### 出力

| プロパティ | 説明 |
|-----------|------|
| `state` | 全状態（drag/resize/popover/preview/modal） |
| `handlers` | マウスイベントハンドラー |
| `actions` | ポップオーバー操作アクション |
| `modalHandlers` | モーダル確認/キャンセルハンドラー |

## クリック vs ドラッグ判定

ドラッグ/リサイズ終了後にクリックイベントが発火する問題を防ぐため、`interactionEndTimeRef`を使用：

```typescript
const interactionEndTimeRef = useRef<number>(0)

const isInteracting = () => {
  return (
    dragState.isDragging ||
    resizeState.isResizing ||
    Date.now() - interactionEndTimeRef.current < 100
  )
}
```

mouseUp後100ms以内のクリックは無視される。

## 設定オプション

| オプション | デフォルト | 説明 |
|-----------|-----------|------|
| `quickDragDrop` | `false` | `true`: 即座にドロップ確定、`false`: 確認モーダル表示 |
| `quickResize` | `false` | `true`: 即座にリサイズ確定、`false`: 確認モーダル表示 |
| `enableDragDrop` | `true` | ドラッグ＆ドロップ有効化 |
| `enableResize` | `true` | リサイズ有効化 |

## AllDayRow ドラッグ

終日イベントは`AllDayRow`コンポーネント内で独自のドラッグ機能を持つ：

```mermaid
sequenceDiagram
    participant User
    participant ADR as AllDayRow
    participant TG as TimeGrid

    User->>ADR: mouseDown (終日イベント)
    ADR->>ADR: setDragState開始
    
    User->>ADR: mouseMove
    ADR->>ADR: 列インデックス計算
    ADR->>ADR: setTargetColumnIndex
    
    User->>ADR: mouseUp
    ADR->>ADR: newDate計算
    
    alt 日付が変わった場合
        ADR->>TG: onEventDrop(event, newDate)
    end
    
    ADR->>ADR: 状態リセット
```

## ファイル構成

```
src/
├── lib/
│   ├── hooks/
│   │   └── use-time-grid-interaction.ts  # メインフック
│   └── constants.ts                       # TIME_SLOT_HEIGHT等
└── components/
    └── calendar/
        ├── time-grid.tsx                  # グリッドコンポーネント
        ├── time-grid-event.tsx            # イベントコンポーネント
        ├── all-day-row.tsx                # 終日イベント行
        ├── event-popover.tsx              # ポップオーバー
        ├── event-resize-modal.tsx         # リサイズ確認
        └── event-move-modal.tsx           # 移動確認
```
