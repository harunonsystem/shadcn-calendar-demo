import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeGridInteraction } from './use-time-grid-interaction'
import { CalendarEvent, CalendarConfig } from '@/types/calendar'

// モックイベント
const mockEvent: CalendarEvent = {
  id: 'test-1',
  title: 'Test Event',
  startDate: new Date('2026-01-01T10:00:00'),
  endDate: new Date('2026-01-01T11:00:00'),
  allDay: false,
}

const mockConfig: CalendarConfig = {
  enableResize: true,
  quickResize: false,
  quickDragDrop: false,
}

const mockDates = [new Date('2026-01-01'), new Date('2026-01-02'), new Date('2026-01-03')]

describe('useTimeGridInteraction', () => {
  let mockGridRef: { current: HTMLDivElement | null }

  beforeEach(() => {
    // モックDOMを作成
    const mockDiv = document.createElement('div')
    Object.defineProperty(mockDiv, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        right: 300,
        bottom: 1152, // 24時間 * 48px
        width: 300,
        height: 1152,
      }),
    })
    mockGridRef = { current: mockDiv }
  })

  describe('Popover management', () => {
    it('ドラッグ開始時にpopoverが閉じる', () => {
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: mockConfig,
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
        }),
      )

      // まずpopoverを開く
      act(() => {
        result.current.actions.openPopover(mockEvent, { x: 100, y: 100 })
      })

      expect(result.current.state.popoverState.isOpen).toBe(true)

      // ドラッグを開始
      const mockMouseEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 100,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 90 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseEvent, mockEvent)
      })

      expect(result.current.state.popoverState.isOpen).toBe(false)
    })

    it('リサイズ開始時にpopoverが閉じる', () => {
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: mockConfig,
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
        }),
      )

      // まずpopoverを開く
      act(() => {
        result.current.actions.openPopover(mockEvent, { x: 100, y: 100 })
      })

      expect(result.current.state.popoverState.isOpen).toBe(true)

      // リサイズを開始
      const mockMouseEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 100,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 90 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseEvent, mockEvent, 'bottom')
      })

      expect(result.current.state.popoverState.isOpen).toBe(false)
      expect(result.current.state.resizeState.isResizing).toBe(true)
    })

    it('インタラクション中はpopoverを開けない', () => {
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: mockConfig,
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
        }),
      )

      // リサイズを開始
      const mockMouseEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 100,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 90 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseEvent, mockEvent, 'bottom')
      })

      // リサイズ中にpopoverを開こうとする
      act(() => {
        result.current.actions.openPopover(mockEvent, { x: 100, y: 100 })
      })

      expect(result.current.state.popoverState.isOpen).toBe(false)
    })
  })

  describe('Resize preview', () => {
    it('リサイズ中にプレビューが更新される', () => {
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: mockConfig,
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
        }),
      )

      // リサイズを開始
      const mockMouseDownEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 480, // 10:00の位置
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 480 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseDownEvent, mockEvent, 'bottom')
      })

      expect(result.current.state.resizeState.isResizing).toBe(true)

      // マウスを移動してリサイズ
      const mockMouseMoveEvent = {
        clientX: 100,
        clientY: 576, // 12:00の位置（2時間分伸ばす）
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseMove(mockMouseMoveEvent)
      })

      expect(result.current.state.resizePreview).not.toBeNull()
      expect(result.current.state.resizePreview?.eventId).toBe('test-1')
    })
  })

  describe('Modal confirmation', () => {
    it('quickResize=falseの場合、リサイズ完了時にモーダルが表示される', () => {
      const onEventResize = vi.fn()
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: { ...mockConfig, quickResize: false },
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
          onEventResize,
        }),
      )

      // リサイズを開始
      const mockMouseDownEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 528, // 11:00の位置
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 528 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseDownEvent, mockEvent, 'bottom')
      })

      // マウスを移動
      const mockMouseMoveEvent = {
        clientX: 100,
        clientY: 576, // 12:00の位置
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseMove(mockMouseMoveEvent)
      })

      // マウスアップ
      const mockMouseUpEvent = {
        clientX: 100,
        clientY: 576,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseUp(mockMouseUpEvent)
      })

      expect(result.current.state.showResizeModal).toBe(true)
      expect(result.current.state.pendingResize).not.toBeNull()
      expect(onEventResize).not.toHaveBeenCalled()
    })

    it('モーダル確認後にonEventResizeが呼ばれる', () => {
      const onEventResize = vi.fn()
      const { result } = renderHook(() =>
        useTimeGridInteraction({
          dates: mockDates,
          config: { ...mockConfig, quickResize: false },
          gridRef: mockGridRef as React.RefObject<HTMLDivElement>,
          onEventResize,
        }),
      )

      // リサイズフローを実行
      const mockMouseDownEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 528,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 90, top: 528 }),
        },
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseDown(mockMouseDownEvent, mockEvent, 'bottom')
      })

      const mockMouseUpEvent = {
        clientX: 100,
        clientY: 576,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handlers.handleMouseUp(mockMouseUpEvent)
      })

      // モーダル確認
      act(() => {
        result.current.modalHandlers.handleResizeConfirm()
      })

      expect(onEventResize).toHaveBeenCalled()
      expect(result.current.state.showResizeModal).toBe(false)
    })
  })
})
