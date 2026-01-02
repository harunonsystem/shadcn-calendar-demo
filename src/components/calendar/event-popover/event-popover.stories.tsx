import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { EventPopover } from './index'
import { CalendarEvent, CategoryColor } from '@/types/calendar'
import { fn } from '@storybook/test'

const baseEvent: CalendarEvent = {
  id: '1',
  title: 'プロジェクトミーティング',
  description: '新機能の仕様検討と進捗確認を行います。',
  startDate: new Date(2026, 0, 2, 14, 0),
  endDate: new Date(2026, 0, 2, 15, 30),
  category: 'work',
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}

const categories: CategoryColor[] = [
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

const meta: Meta<typeof EventPopover> = {
  title: 'Calendar/EventPopover',
  component: EventPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    event: baseEvent,
    language: 'ja',
    isOpen: true,
    position: { x: 100, y: 100 },
    categories,
    onClose: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onOpenDetail: fn(),
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
type Story = StoryObj<typeof EventPopover>

/** 日本語表示 */
export const Japanese: Story = {}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
    event: {
      ...baseEvent,
      title: 'Project Meeting',
      description: 'Discuss new feature specifications and check progress.',
    },
  },
}

/** 終日イベント */
export const AllDayEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '社員旅行',
      description: '箱根温泉へ',
      allDay: true,
    },
  },
}

/** 説明がないイベント */
export const NoDescription: Story = {
  args: {
    event: {
      ...baseEvent,
      description: undefined,
    },
  },
}

/** 長いタイトル */
export const LongTitle: Story = {
  args: {
    event: {
      ...baseEvent,
      title: 'これはとても長いタイトルのイベントで省略されて表示されるはずです',
    },
  },
}

/** 長い説明文 */
export const LongDescription: Story = {
  args: {
    event: {
      ...baseEvent,
      description:
        'これはとても長い説明文です。複数行にわたって表示されますが、最大3行で切り詰められます。詳細な内容はイベント詳細画面で確認できます。開発チーム全員が参加する週次の定例ミーティングです。',
    },
  },
}

/** 仕事カテゴリ（赤） */
export const WorkCategory: Story = {
  args: {
    event: {
      ...baseEvent,
      category: 'work',
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
    },
  },
}

/** プライベートカテゴリ（緑） */
export const PersonalCategory: Story = {
  args: {
    event: {
      ...baseEvent,
      title: 'ジョギング',
      category: 'personal',
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
    },
  },
}

/** 閉じた状態（表示なし） */
export const Closed: Story = {
  args: {
    isOpen: false,
  },
}
