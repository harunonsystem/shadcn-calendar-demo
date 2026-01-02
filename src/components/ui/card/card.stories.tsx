import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './index'
import { Button } from '../button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

/** 基本的なカード */
export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文がここに入ります。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツ部分です。ここに任意の要素を配置できます。</p>
      </CardContent>
      <CardFooter>
        <Button>アクション</Button>
      </CardFooter>
    </Card>
  ),
}

/** ヘッダーのみ */
export const HeaderOnly: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>シンプルなカード</CardTitle>
      </CardHeader>
    </Card>
  ),
}

/** コンテンツのみ */
export const ContentOnly: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <p>ヘッダーやフッターのないシンプルなカードです。</p>
      </CardContent>
    </Card>
  ),
}

/** フォーム用カード */
export const FormCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>イベントを追加</CardTitle>
        <CardDescription>新しいイベントの情報を入力してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <input className="w-full px-3 py-2 border rounded-md" placeholder="イベント名" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">説明</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            placeholder="説明を入力..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          キャンセル
        </Button>
        <Button className="flex-1">作成</Button>
      </CardFooter>
    </Card>
  ),
}

/** イベント詳細カード */
export const EventCard: Story = {
  render: () => (
    <Card>
      <div className="px-4 py-3 rounded-t-lg" style={{ backgroundColor: '#3b82f6' }}>
        <h3 className="font-semibold text-lg text-white">プロジェクトミーティング</h3>
        <span className="text-sm text-white/80">仕事</span>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="text-sm">📅 1/2 (木)</div>
        <div className="text-sm">🕐 14:00 - 15:30</div>
        <div className="text-sm text-muted-foreground">新機能の仕様検討と進捗確認</div>
      </CardContent>
    </Card>
  ),
}
