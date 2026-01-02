import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { TimeGridEvent } from './index'
import { CalendarEvent, CalendarConfig } from '@/types/calendar'
import { fn } from '@storybook/test'

const baseEvent: CalendarEvent = {
  id: '1',
  title: 'ミーティング',
  description: '週次定例ミーティング',
  startDate: new Date(2026, 0, 2, 10, 0),
  endDate: new Date(2026, 0, 2, 11, 0),
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}

const baseConfig: CalendarConfig = {
  enableResize: true,
  categoryColors: [],
}

const meta: Meta<typeof TimeGridEvent> = {
  title: 'Calendar/TimeGridEvent',
  component: TimeGridEvent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  args: {
    event: baseEvent,
    config: baseConfig,
    width: 100,
    left: 0,
    zIndex: 1,
    isDragging: false,
    isResizing: false,
    isDragStarted: false,
    onMouseDown: fn(),
    onClick: fn(),
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div style={{ position: 'relative', width: '200px', height: '400px', background: '#f0f0f0' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TimeGridEvent>

/** 通常状態のイベント */
export const Default: Story = {}

/** 1時間イベント */
export const OneHourEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '1時間のミーティング',
    },
  },
}

/** 30分の短いイベント */
export const ShortEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '短い打ち合わせ',
      endDate: new Date(2026, 0, 2, 10, 30),
    },
  },
}

/** 3時間の長いイベント */
export const LongEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      title: 'ワークショップ',
      description: '新機能開発のためのブレインストーミング',
      endDate: new Date(2026, 0, 2, 13, 0),
    },
  },
}

/** ドラッグ中の状態 */
export const Dragging: Story = {
  args: {
    isDragging: true,
    isDragStarted: true,
  },
}

/** リサイズ中の状態 */
export const Resizing: Story = {
  args: {
    isResizing: true,
    resizePreview: {
      top: 0,
      height: 120,
    },
  },
}

/** 異なる背景色のイベント（カテゴリ別） */
export const WorkCategory: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '仕事',
      category: 'work',
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
    },
  },
}

/** プライベートカテゴリ */
export const PersonalCategory: Story = {
  args: {
    event: {
      ...baseEvent,
      title: 'ジム',
      category: 'personal',
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
    },
  },
}

/** リサイズ無効 */
export const ResizeDisabled: Story = {
  args: {
    config: {
      ...baseConfig,
      enableResize: false,
    },
  },
}
