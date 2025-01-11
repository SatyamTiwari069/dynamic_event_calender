import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDay, Event } from '@/types';
import { useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { EventDialog } from './EventDialog';

interface EventListProps {
  day: CalendarDay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: () => void;
}

export function EventList({ day, open, onOpenChange, onAddEvent }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();

  const filteredEvents = day.events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = (eventId: string) => {
    const events: Event[] = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    window.location.reload(); // Refresh to update the calendar
  };

  const handleExport = () => {
    const events = day.events;
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${day.date.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Events for {day.date.toLocaleDateString()}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleExport}>
                  Export
                </Button>
                <Button size="sm" onClick={onAddEvent}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="mt-4 space-y-2">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`
                    p-4 rounded-lg border
                    ${event.color === 'work' && 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}
                    ${event.color === 'personal' && 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}
                    ${event.color === 'other' && 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'}
                    ${!event.color && 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </p>
                      {event.description && (
                        <p className="mt-1 text-sm">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No events found
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {editingEvent && (
        <EventDialog
          day={day}
          open={!!editingEvent}
          onOpenChange={() => setEditingEvent(undefined)}
          eventToEdit={editingEvent}
        />
      )}
    </>
  );
}