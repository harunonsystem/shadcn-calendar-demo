import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './index'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Select>

/** デフォルト */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">オプション 1</SelectItem>
        <SelectItem value="option2">オプション 2</SelectItem>
        <SelectItem value="option3">オプション 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/** カテゴリ選択 */
export const CategorySelect: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="work">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            仕事
          </div>
        </SelectItem>
        <SelectItem value="personal">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            プライベート
          </div>
        </SelectItem>
        <SelectItem value="meeting">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            ミーティング
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

/** グループ付き */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="ビューを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>カレンダー</SelectLabel>
          <SelectItem value="month">月表示</SelectItem>
          <SelectItem value="week">週表示</SelectItem>
          <SelectItem value="day">日表示</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>その他</SelectLabel>
          <SelectItem value="category">カテゴリ表示</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/** 選択済み */
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="week">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">月表示</SelectItem>
        <SelectItem value="week">週表示</SelectItem>
        <SelectItem value="day">日表示</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/** 小サイズ */
export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm">
        <SelectValue placeholder="小サイズ" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">オプション 1</SelectItem>
        <SelectItem value="option2">オプション 2</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/** 無効アイテム */
export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">有効なオプション</SelectItem>
        <SelectItem value="option2" disabled>
          無効なオプション
        </SelectItem>
        <SelectItem value="option3">有効なオプション</SelectItem>
      </SelectContent>
    </Select>
  ),
}
