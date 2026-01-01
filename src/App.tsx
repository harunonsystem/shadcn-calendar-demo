import { useState } from 'react'
import { Calendar } from '@/components/calendar/calendar'
import { CalendarEvent, CalendarConfig } from '@/types/calendar'
import { allMockEvents } from '@/fixtures/mock-events'

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(allMockEvents)

  const [config] = useState<CalendarConfig>({
    showNowIndicator: true,
    nowIndicatorColor: '#ef4444', // 赤色
    language: 'ja',
    defaultView: 'month',
    enableDragDrop: true,
    enableResize: true,
    eventStackMode: 'stack',
    quickResize: false,
    quickDragDrop: false, // true: 即座に移動, false: modal確認
  })

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event)
  }

  const handleEventUpdate = (event: CalendarEvent) => {
    console.log('Event update:', event)
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? event : e)))
  }

  const handleEventDelete = (event: CalendarEvent) => {
    console.log('Event delete:', event)
    // Here you would typically delete the event from your state/database
  }

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date)
  }

  const handleCreateEvent = () => {
    console.log('Create new event')
  }

  const handleEventDrop = (event: CalendarEvent, newDate: Date, newStartTime: number) => {
    console.log('Event dropped:', {
      event: event.title,
      newDate: newDate.toLocaleDateString(),
      newStartTime: `${Math.floor(newStartTime / 60)}:${(newStartTime % 60).toString().padStart(2, '0')}`,
    })

    setEvents((prevEvents) =>
      prevEvents.map((e) => {
        if (e.id === event.id) {
          const originalStart = new Date(e.startDate)
          const originalEnd = new Date(e.endDate)
          const duration = originalEnd.getTime() - originalStart.getTime()

          // 新しい開始時間を設定
          const newStartDate = new Date(newDate)
          newStartDate.setHours(Math.floor(newStartTime / 60), newStartTime % 60, 0, 0)

          // 継続時間を保持して終了時間を計算
          const newEndDate = new Date(newStartDate.getTime() + duration)

          return {
            ...e,
            startDate: newStartDate,
            endDate: newEndDate,
          }
        }
        return e
      }),
    )
  }

  const handleEventResize = (event: CalendarEvent, newStartTime: number, newEndTime: number) => {
    console.log('Event resized:', {
      event: event.title,
      newStartTime: `${Math.floor(newStartTime / 60)}:${(newStartTime % 60).toString().padStart(2, '0')}`,
      newEndTime: `${Math.floor(newEndTime / 60)}:${(newEndTime % 60).toString().padStart(2, '0')}`,
    })

    setEvents((prevEvents) =>
      prevEvents.map((e) => {
        if (e.id === event.id) {
          const eventDate = new Date(e.startDate)

          // 新しい開始時間を設定
          const newStartDate = new Date(eventDate)
          newStartDate.setHours(Math.floor(newStartTime / 60), newStartTime % 60, 0, 0)

          // 新しい終了時間を設定
          const newEndDate = new Date(eventDate)
          newEndDate.setHours(Math.floor(newEndTime / 60), newEndTime % 60, 0, 0)

          return {
            ...e,
            startDate: newStartDate,
            endDate: newEndDate,
          }
        }
        return e
      }),
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Shadcn Calendar Demo</h1>
        <Calendar
          events={events}
          config={config}
          onEventClick={handleEventClick}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onDateClick={handleDateClick}
          onCreateEvent={handleCreateEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
        />
      </div>
    </div>
  )
}

export default App
