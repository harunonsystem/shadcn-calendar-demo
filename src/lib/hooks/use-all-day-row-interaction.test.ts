import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAllDayRowInteraction } from './use-all-day-row-interaction'
import { CalendarEvent } from '@/types/calendar'
import React from 'react'

// Mock event for testing
const createMockEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'test-event-1',
  title: 'Test All Day Event',
  startDate: new Date(2026, 0, 1, 0, 0),
  endDate: new Date(2026, 0, 1, 23, 59),
  allDay: true,
  category: '仕事',
  ...overrides,
})

// Mock dates array
const mockDates = [new Date(2026, 0, 1), new Date(2026, 0, 2), new Date(2026, 0, 3)]

describe('useAllDayRowInteraction', () => {
  const mockOnEventDrop = vi.fn()
  let mockRowRef: React.RefObject<HTMLDivElement | null>

  beforeEach(() => {
    vi.clearAllMocks()
    // Create a mock ref with getBoundingClientRect
    mockRowRef = {
      current: {
        getBoundingClientRect: () => ({
          left: 0,
          right: 300,
          top: 0,
          bottom: 50,
          width: 300,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
      } as HTMLDivElement,
    }
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useAllDayRowInteraction({
        dates: mockDates,
        rowRef: mockRowRef,
        onEventDrop: mockOnEventDrop,
      }),
    )

    expect(result.current.state.dragState.isDragging).toBe(false)
    expect(result.current.state.dragState.draggedEvent).toBeNull()
    expect(result.current.state.dragState.targetColumnIndex).toBeNull()
  })

  it('should not set isDragging to true immediately on handleMouseDown (dragging starts on move)', () => {
    const { result } = renderHook(() =>
      useAllDayRowInteraction({
        dates: mockDates,
        rowRef: mockRowRef,
        onEventDrop: mockOnEventDrop,
      }),
    )

    const mockEvent = createMockEvent()
    const mockMouseEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      clientX: 100,
      clientY: 25,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handlers.handleMouseDown(mockMouseEvent, mockEvent)
    })

    // mouseDown直後はまだドラッグ開始しない（閾値を超えた移動が必要）
    expect(result.current.state.dragState.isDragging).toBe(false)
    expect(result.current.state.dragState.draggedEvent).toBeNull()
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled()
  })

  it('should return false for isInteracting when not dragging', () => {
    const { result } = renderHook(() =>
      useAllDayRowInteraction({
        dates: mockDates,
        rowRef: mockRowRef,
        onEventDrop: mockOnEventDrop,
      }),
    )

    expect(result.current.actions.isInteracting()).toBe(false)
  })

  it('should return false for isInteracting immediately after mouseDown (before drag starts)', () => {
    const { result } = renderHook(() =>
      useAllDayRowInteraction({
        dates: mockDates,
        rowRef: mockRowRef,
        onEventDrop: mockOnEventDrop,
      }),
    )

    const mockEvent = createMockEvent()
    const mockMouseEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      clientX: 100,
      clientY: 25,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handlers.handleMouseDown(mockMouseEvent, mockEvent)
    })

    // mouseDown直後はまだドラッグ開始前なのでfalse
    expect(result.current.actions.isInteracting()).toBe(false)
  })

  it('should add event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    renderHook(() =>
      useAllDayRowInteraction({
        dates: mockDates,
        rowRef: mockRowRef,
        onEventDrop: mockOnEventDrop,
      }),
    )

    // useEffectでリスナーが追加される
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))

    addEventListenerSpy.mockRestore()
  })
})
