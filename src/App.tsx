import { useState } from 'react'
import { Calendar } from '@/components/calendar/calendar'
import { CalendarEvent } from '@/types/calendar'

function App() {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'ミーティング',
      description: 'チームミーティング',
      startDate: new Date(),
      endDate: new Date(),
      color: 'blue'
    },
    {
      id: '2',
      title: '締切',
      description: 'プロジェクト締切',
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 86400000),
      color: 'red'
    }
  ])

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event)
  }

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date)
  }

  const handleCreateEvent = () => {
    console.log('Create new event')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">ShadCN Calendar Demo</h1>
        <Calendar
          events={events}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onCreateEvent={handleCreateEvent}
        />
      </div>
    </div>
  )
}

export default App
