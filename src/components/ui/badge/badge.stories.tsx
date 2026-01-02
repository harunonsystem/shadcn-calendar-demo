import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './index'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
  args: {
    children: 'バッジ',
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/** デフォルト（Primary） */
export const Default: Story = {}

/** Secondary */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'セカンダリ',
  },
}

/** Destructive */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '削除',
  },
}

/** Outline */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'アウトライン',
  },
}

/** カテゴリ表示の例 */
export const CategoryBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge style={{ backgroundColor: '#3b82f6' }}>仕事</Badge>
      <Badge style={{ backgroundColor: '#22c55e' }}>プライベート</Badge>
      <Badge style={{ backgroundColor: '#f59e0b' }}>ミーティング</Badge>
    </div>
  ),
}

/** ステータス表示の例 */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">完了</Badge>
      <Badge variant="secondary">進行中</Badge>
      <Badge variant="destructive">遅延</Badge>
      <Badge variant="outline">未着手</Badge>
    </div>
  ),
}

/** 全バリエーション一覧 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
