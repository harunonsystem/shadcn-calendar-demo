import { TIME_SLOT_INTERVAL_MINUTES, HOURS_PER_DAY } from '@/lib/constants'

export interface TimeSlot {
  hour: number
  minute: number
  label: string
  isMainHour: boolean
}

/**
 * 24時間分のタイムスロット配列を生成
 * 各時間を30分間隔で分割
 */
export function generateTimeSlots(): TimeSlot[] {
  const hours = Array.from({ length: HOURS_PER_DAY }, (_, i) => i)
  return hours.flatMap((hour) => {
    const slots: TimeSlot[] = [{ hour, minute: 0, label: `${hour}`, isMainHour: true }]

    // 30分インターバルの場合は30分スロットを追加
    if (TIME_SLOT_INTERVAL_MINUTES <= 30) {
      slots.push({ hour, minute: 30, label: '', isMainHour: false })
    }

    return slots
  })
}
