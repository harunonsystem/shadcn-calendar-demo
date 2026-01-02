import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { EventMoveModal } from './index'
import { CalendarEvent, CategoryColor } from '@/types/calendar'

const mockCategories: CategoryColor[] = [
  { category: 'work', label: '仕事', backgroundColor: '#3b82f6', borderColor: '#2563eb' },
  {
    category: 'personal',
    label: 'プライベート',
    backgroundColor: '#22c55e',
    borderColor: '#16a34a',
  },
]

const mockEvent: CalendarEvent = {
  id: '1',
  title: 'ミーティング',
  startDate: new Date(2026, 0, 2, 10, 0),
  endDate: new Date(2026, 0, 2, 11, 0),
  category: 'work',
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}

const meta: Meta<typeof EventMoveModal> = {
  title: 'Calendar/EventMoveModal',
  component: EventMoveModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    event: mockEvent,
    language: 'ja',
    isOpen: true,
    newDate: new Date(2026, 0, 3),
    newStartMinutes: 14 * 60,
    categoryColors: mockCategories,
    onConfirm: fn(),
    onCancel: fn(),
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
type Story = StoryObj<typeof EventMoveModal>

/** 日付と時間が変わる場合 */
export const DateAndTimeChange: Story = {}

/** 時間だけ変わる場合（同一日） */
export const TimeChangeOnly: Story = {
  args: {
    newDate: new Date(2026, 0, 2),
    newStartMinutes: 15 * 60,
  },
}

/** 日付だけ変わる場合（同一時間） */
export const DateChangeOnly: Story = {
  args: {
    newDate: new Date(2026, 0, 5),
    newStartMinutes: 10 * 60,
  },
}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}
