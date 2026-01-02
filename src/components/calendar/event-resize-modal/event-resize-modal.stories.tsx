import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { EventResizeModal } from './index'
import { CalendarEvent, CategoryColor } from '@/types/calendar'

const mockCategories: CategoryColor[] = [
  { category: 'work', label: '仕事', backgroundColor: '#3b82f6', borderColor: '#2563eb' },
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

const meta: Meta<typeof EventResizeModal> = {
  title: 'Calendar/EventResizeModal',
  component: EventResizeModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    event: mockEvent,
    language: 'ja',
    isOpen: true,
    newStartTime: 10 * 60,
    newEndTime: 12 * 60,
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
type Story = StoryObj<typeof EventResizeModal>

/** 終了時間を延長 */
export const ExtendEnd: Story = {}

/** 開始時間を早める */
export const EarlierStart: Story = {
  args: {
    newStartTime: 9 * 60,
    newEndTime: 11 * 60,
  },
}

/** 両方変更 */
export const BothChange: Story = {
  args: {
    newStartTime: 9 * 60,
    newEndTime: 12 * 60,
  },
}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}
