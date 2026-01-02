import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './index'
import { Plus, Mail } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
  args: {
    children: 'ボタン',
    variant: 'default',
    size: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Button>

/** デフォルト（Primary） */
export const Default: Story = {}

/** Destructive（削除など危険な操作） */
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
    children: 'キャンセル',
  },
}

/** Secondary */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '保存',
  },
}

/** Ghost */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '詳細',
  },
}

/** Link */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'もっと見る',
  },
}

/** 小サイズ */
export const Small: Story = {
  args: {
    size: 'sm',
    children: '小さいボタン',
  },
}

/** 大サイズ */
export const Large: Story = {
  args: {
    size: 'lg',
    children: '大きいボタン',
  },
}

/** アイコンボタン */
export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    children: <Plus className="h-4 w-4" />,
  },
}

/** アイコン付きボタン */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail className="mr-2 h-4 w-4" />
        メール送信
      </>
    ),
  },
}

/** 無効状態 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '無効',
  },
}

/** 全バリエーション一覧 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

/** 全サイズ一覧 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
}
