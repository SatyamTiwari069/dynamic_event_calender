import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMonthDays } from '@/lib/calendar';
import { CalendarDay } from '@/types';
import { EventDialog } from './EventDialog';
import { EventList } from './EventList';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventList, setShowEventList] = useState(false);

  const days = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    if (day.events.length > 0) {
      setShowEventList(true);
    } else {
      setShowEventDialog(true);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Card className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map(day => (
            <div
              key={day}
              className="p-2 text-center font-semibold text-sm text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                p-2 min-h-[100px] text-left transition-colors
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${!day.isCurrentMonth && 'text-gray-400 dark:text-gray-600'}
                ${day.isToday && 'ring-2 ring-primary'}
                ${selectedDay?.date === day.date && 'bg-gray-100 dark:bg-gray-700'}
                ${day.events.length > 0 && 'font-semibold'}
              `}
            >
              <span className="block mb-1">{day.date.getDate()}</span>
              {day.events.length > 0 && (
                <div className="flex flex-col gap-1">
                  {day.events.slice(0, 2).map((event, i) => (
                    <div
                      key={i}
                      className={`
                        text-xs p-1 rounded truncate
                        ${event.color === 'work' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'}
                        ${event.color === 'personal' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}
                        ${event.color === 'other' && 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'}
                        ${!event.color && 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}
                      `}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {selectedDay && (
        <>
          <EventDialog
            day={selectedDay}
            open={showEventDialog}
            onOpenChange={setShowEventDialog}
          />
          <EventList
            day={selectedDay}
            open={showEventList}
            onOpenChange={setShowEventList}
            onAddEvent={() => {
              setShowEventList(false);
              setShowEventDialog(true);
            }}
          />
        </>
      )}
    </div>
  );
}