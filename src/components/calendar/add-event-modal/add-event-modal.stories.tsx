import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { AddEventModal } from './index'
import { CategoryColor } from '@/types/calendar'

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

const meta: Meta<typeof AddEventModal> = {
  title: 'Calendar/AddEventModal',
  component: AddEventModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    language: 'ja',
    isOpen: true,
    initialDate: new Date(2026, 0, 2),
    initialStartMinutes: 10 * 60,
    categories: mockCategories,
    onClose: fn(),
    onCreate: fn(),
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
type Story = StoryObj<typeof AddEventModal>

/** 日本語表示 */
export const Japanese: Story = {}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}

/** カテゴリなし */
export const NoCategories: Story = {
  args: {
    categories: [],
  },
}

/** 終日イベント用（午前0時開始） */
export const AllDayStart: Story = {
  args: {
    initialStartMinutes: 0,
  },
}

/** 午後開始 */
export const AfternoonStart: Story = {
  args: {
    initialStartMinutes: 14 * 60,
  },
}

/** 閉じた状態（非表示） */
export const Closed: Story = {
  args: {
    isOpen: false,
  },
}
