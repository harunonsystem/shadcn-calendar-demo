import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './index'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
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
type Story = StoryObj<typeof Textarea>

/** デフォルト */
export const Default: Story = {}

/** プレースホルダー付き */
export const WithPlaceholder: Story = {
  args: {
    placeholder: 'イベントの説明を入力してください...',
  },
}

/** 値が入力済み */
export const WithValue: Story = {
  args: {
    defaultValue: '週次定例ミーティングの内容です。\n・進捗確認\n・課題共有\n・次週の予定',
  },
}

/** 行数指定 */
export const WithRows: Story = {
  args: {
    rows: 5,
    placeholder: '5行分の高さ',
  },
}

/** 無効状態 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '編集できません',
  },
}

/** エラー状態 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: '無効な入力',
  },
}
