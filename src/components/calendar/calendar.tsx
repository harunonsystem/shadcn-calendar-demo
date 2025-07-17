import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { ViewMode, CalendarEvent } from '@/types/calendar'
import { getMonthDays, formatDate, isToday, isSameDay } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface CalendarProps {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
}

export function Calendar({ events = [], onEventClick, onDateClick, onCreateEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthDays = getMonthDays(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), date)
    )
  }

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const weekDays = ['月', '火', '水', '木', '金', '土', '日']

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {year}年 {monthNames[month]}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={onCreateEvent}
              className="ml-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              イベント追加
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
          {monthDays.map(date => {
            const dayEvents = getEventsForDate(date)
            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "min-h-24 p-2 border rounded-md cursor-pointer hover:bg-accent",
                  isToday(date) && "bg-primary/10 border-primary"
                )}
                onClick={() => onDateClick?.(date)}
              >
                <div className={cn(
                  "text-sm font-medium",
                  isToday(date) && "text-primary font-bold"
                )}>
                  {date.getDate()}
                </div>
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <Badge
                      key={event.id}
                      variant="secondary"
                      className="text-xs truncate block cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(event)
                      }}
                    >
                      {event.title}
                    </Badge>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}