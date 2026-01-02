import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { CategorySelect } from './index'
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

const meta: Meta<typeof CategorySelect> = {
  title: 'Calendar/CategorySelect',
  component: CategorySelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    value: '',
    categories: mockCategories,
    language: 'ja',
    onChange: fn(),
    showLabel: true,
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div style={{ width: '300px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CategorySelect>

/** プレースホルダー表示（未選択） */
export const Empty: Story = {}

/** カテゴリ選択済み */
export const Selected: Story = {
  args: {
    value: 'work',
  },
}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}

/** ラベルなし */
export const NoLabel: Story = {
  args: {
    showLabel: false,
  },
}

/** カテゴリなし（テキスト入力フォールバック） */
export const NoCategories: Story = {
  args: {
    categories: [],
  },
}
