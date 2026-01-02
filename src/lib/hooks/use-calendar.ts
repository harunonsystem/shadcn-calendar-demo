import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { currentDateAtom } from '@/lib/atoms'

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      if (direction === 'next') {
        if (month === 11) {
          setCurrentDate(new Date(year + 1, 0, 1))
        } else {
          setCurrentDate(new Date(year, month + 1, 1))
        }
      } else {
        if (month === 0) {
          setCurrentDate(new Date(year - 1, 11, 1))
        } else {
          setCurrentDate(new Date(year, month - 1, 1))
        }
      }
    },
    [currentDate, setCurrentDate],
  )

  const goToDate = useCallback(
    (date: Date) => {
      setCurrentDate(date)
    },
    [setCurrentDate],
  )

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [setCurrentDate])

  const goToPrevMonth = useCallback(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    if (month === 0) {
      setCurrentDate(new Date(year - 1, 11, 1))
    } else {
      setCurrentDate(new Date(year, month - 1, 1))
    }
  }, [currentDate, setCurrentDate])

  const goToNextMonth = useCallback(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    if (month === 11) {
      setCurrentDate(new Date(year + 1, 0, 1))
    } else {
      setCurrentDate(new Date(year, month + 1, 1))
    }
  }, [currentDate, setCurrentDate])

  return {
    currentDate,
    navigate,
    goToDate,
    goToToday,
    goToPrevMonth,
    goToNextMonth,
  }
}
