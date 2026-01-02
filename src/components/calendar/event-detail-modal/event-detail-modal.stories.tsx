import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { EventDetailModal } from './index'
import { CalendarEvent, CategoryColor } from '@/types/calendar'

const mockCategories: CategoryColor[] = [
  { category: 'work', label: '仕事', backgroundColor: '#3b82f6', borderColor: '#2563eb' },
  {
    category: 'personal',
    label: 'プライベート',
    backgroundColor: '#22c55e',
    borderColor: '#16a34a',
  },
  {
    category: 'meeting',
    label: 'ミーティング',
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
  },
]

const mockEvent: CalendarEvent = {
  id: '1',
  title: 'プロジェクトミーティング',
  description:
    '新機能の仕様検討と進捗確認を行います。開発チーム全員が参加する週次の定例ミーティングです。',
  startDate: new Date(2026, 0, 2, 14, 0),
  endDate: new Date(2026, 0, 2, 15, 30),
  category: 'work',
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}

const meta: Meta<typeof EventDetailModal> = {
  title: 'Calendar/EventDetailModal',
  component: EventDetailModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    event: mockEvent,
    language: 'ja',
    isOpen: true,
    categories: mockCategories,
    initialEditMode: false,
    onClose: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onUpdate: fn(),
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EventDetailModal>

/** 日本語表示（閲覧モード） */
export const Japanese: Story = {}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
    event: {
      ...mockEvent,
      title: 'Project Meeting',
      description: 'Discuss new feature specifications and check progress.',
    },
  },
}

/** 編集モード */
export const EditMode: Story = {
  args: {
    initialEditMode: true,
  },
}

/** 終日イベント */
export const AllDayEvent: Story = {
  args: {
    event: {
      ...mockEvent,
      title: '社員旅行',
      description: '箱根温泉へ',
      allDay: true,
    },
  },
}

/** 説明なし */
export const NoDescription: Story = {
  args: {
    event: {
      ...mockEvent,
      description: undefined,
    },
  },
}

/** カテゴリなし */
export const NoCategory: Story = {
  args: {
    event: {
      ...mockEvent,
      category: undefined,
      backgroundColor: undefined,
      borderColor: undefined,
    },
  },
}

/** 長いタイトルと説明 */
export const LongContent: Story = {
  args: {
    event: {
      ...mockEvent,
      title: 'これはとても長いタイトルのイベントで省略されて表示されるかもしれません',
      description:
        'これはとても長い説明文です。複数行にわたって表示されます。詳細な内容がここに記載されています。開発チーム、デザインチーム、QAチームが全員参加し、四半期のロードマップについて議論します。',
    },
  },
}

/** イベントなし（非表示） */
export const NoEvent: Story = {
  args: {
    event: null,
  },
}

/** 閉じた状態（非表示） */
export const Closed: Story = {
  args: {
    isOpen: false,
  },
}
