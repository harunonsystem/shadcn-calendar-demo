import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { eventsAtom, configAtom, selectedEventAtom, isEventDetailOpenAtom } from '@/lib/atoms'
import { CalendarEvent, CalendarConfig } from '@/types/calendar'

export const useEvents = () => {
  const [events, setEvents] = useAtom(eventsAtom)
  const [config, setConfig] = useAtom(configAtom)
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom)
  const [isDetailOpen, setIsDetailOpen] = useAtom(isEventDetailOpenAtom)

  const addEvent = useCallback(
    (event: CalendarEvent) => {
      setEvents((prev) => [...prev, event])
    },
    [setEvents],
  )

  const updateEvent = useCallback(
    (event: CalendarEvent) => {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
    },
    [setEvents],
  )

  const deleteEvent = useCallback(
    (eventId: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    },
    [setEvents],
  )

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      setSelectedEvent(event)
      setIsDetailOpen(true)
    },
    [setSelectedEvent, setIsDetailOpen],
  )

  const handleEventEdit = useCallback(
    (event: CalendarEvent) => {
      setIsDetailOpen(false)
      updateEvent(event)
    },
    [setIsDetailOpen, updateEvent],
  )

  const handleEventDelete = useCallback(
    (event: CalendarEvent) => {
      setIsDetailOpen(false)
      deleteEvent(event.id)
    },
    [setIsDetailOpen, deleteEvent],
  )

  const closeEventDetail = useCallback(() => {
    setIsDetailOpen(false)
  }, [setIsDetailOpen])

  const syncConfig = useCallback(
    (newConfig: CalendarConfig) => {
      setConfig((prev) => ({ ...prev, ...newConfig }))
    },
    [setConfig],
  )

  return {
    events,
    config,
    selectedEvent,
    isDetailOpen,
    addEvent,
    updateEvent,
    deleteEvent,
    handleEventClick,
    handleEventEdit,
    handleEventDelete,
    closeEventDetail,
    syncConfig,
    setEvents,
  }
}
