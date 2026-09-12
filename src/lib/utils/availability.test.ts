import { describe, expect, it } from 'vitest'
import { getAvailabilityRangesForWindow } from './availability'
import type { AvailabilityRange } from '@/types/calendar'

describe('getAvailabilityRangesForWindow', () => {
  it('指定したリソースと時間帯に重なる空き状況だけを返す', () => {
    const ranges: AvailabilityRange[] = [
      {
        id: 'doctor-available',
        resourceIds: ['doctor-1'],
        start: new Date('2026-07-16T09:00:00+09:00'),
        end: new Date('2026-07-16T12:00:00+09:00'),
        state: 'available',
      },
      {
        id: 'room-unavailable',
        resourceIds: ['room-1'],
        start: new Date('2026-07-16T10:00:00+09:00'),
        end: new Date('2026-07-16T11:00:00+09:00'),
        state: 'unavailable',
      },
      {
        id: 'doctor-next-day',
        resourceIds: ['doctor-1'],
        start: new Date('2026-07-17T09:00:00+09:00'),
        end: new Date('2026-07-17T12:00:00+09:00'),
        state: 'available',
      },
    ]

    const result = getAvailabilityRangesForWindow(ranges, {
      resourceIds: ['doctor-1'],
      start: new Date('2026-07-16T10:00:00+09:00'),
      end: new Date('2026-07-16T11:00:00+09:00'),
    })

    expect(result.map((range) => range.id)).toEqual(['doctor-available'])
  })
})
