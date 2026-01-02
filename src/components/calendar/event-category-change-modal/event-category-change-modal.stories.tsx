import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { EventCategoryChangeModal } from './index'
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
  title: 'ミーティング',
  startDate: new Date(2026, 0, 2, 10, 0),
  endDate: new Date(2026, 0, 2, 11, 0),
  category: '仕事',
  backgroundColor: '#3b82f6',
  borderColor: '#2563eb',
}

const meta: Meta<typeof EventCategoryChangeModal> = {
  title: 'Calendar/EventCategoryChangeModal',
  component: EventCategoryChangeModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    event: mockEvent,
    language: 'ja',
    isOpen: true,
    newCategory: 'プライベート',
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
type Story = StoryObj<typeof EventCategoryChangeModal>

/** 仕事 → プライベート */
export const WorkToPersonal: Story = {}

/** プライベート → ミーティング */
export const PersonalToMeeting: Story = {
  args: {
    event: {
      ...mockEvent,
      category: 'プライベート',
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
    },
    newCategory: 'ミーティング',
  },
}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}
