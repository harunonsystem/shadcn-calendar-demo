import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './index'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'テキストを入力...',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

/** デフォルト */
export const Default: Story = {}

/** プレースホルダー付き */
export const WithPlaceholder: Story = {
  args: {
    placeholder: 'イベント名を入力してください',
  },
}

/** 値が入力済み */
export const WithValue: Story = {
  args: {
    defaultValue: 'ミーティング',
  },
}

/** パスワード */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'パスワード',
  },
}

/** メール */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
}

/** 時刻入力 */
export const Time: Story = {
  args: {
    type: 'time',
    defaultValue: '10:30',
  },
}

/** 日付入力 */
export const Date: Story = {
  args: {
    type: 'date',
  },
}

/** 無効状態 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '入力できません',
  },
}

/** エラー状態 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '無効な入力',
  },
}

/** ファイル選択 */
export const File: Story = {
  args: {
    type: 'file',
  },
}
