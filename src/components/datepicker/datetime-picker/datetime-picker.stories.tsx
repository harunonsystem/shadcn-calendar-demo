import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { fn } from '@storybook/test'
import { DateTimePicker } from './index'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Datepicker/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    value: new Date(2026, 0, 2, 10, 30),
    onChange: fn(),
    language: 'ja',
    weekStartsOn: 0,
    hideTime: false,
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
type Story = StoryObj<typeof DateTimePicker>

/** 日本語表示 */
export const Japanese: Story = {}

/** 英語表示 */
export const English: Story = {
  args: {
    language: 'en',
  },
}

/** ラベル付き */
export const WithLabel: Story = {
  args: {
    label: '開始日時',
  },
}

/** 時刻入力非表示（終日イベント用） */
export const HideTime: Story = {
  args: {
    label: '日付',
    hideTime: true,
  },
}

/** 週の開始日: 月曜 */
export const WeekStartsMonday: Story = {
  args: {
    weekStartsOn: 1,
    label: '週の開始: 月曜',
  },
}

/** カスタムラベル */
export const CustomLabels: Story = {
  args: {
    label: 'Select Date',
    language: 'en',
    labels: {
      cancel: 'Dismiss',
      apply: 'Confirm',
    },
  },
}
