import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDay, Event } from '@/types';
import { formatDate, hasTimeConflict } from '@/lib/calendar';

interface EventDialogProps {
  day: CalendarDay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: Event;
}

export function EventDialog({ day, open, onOpenChange, eventToEdit }: EventDialogProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: eventToEdit?.title || '',
    description: eventToEdit?.description || '',
    startTime: eventToEdit?.startTime || '09:00',
    endTime: eventToEdit?.endTime || '10:00',
    color: eventToEdit?.color || 'work',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: Event = {
      id: eventToEdit?.id || crypto.randomUUID(),
      title: formData.title!,
      description: formData.description,
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      date: formatDate(day.date),
      color: formData.color as Event['color'],
    };

    // Get existing events
    const events: Event[] = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

    // Check for time conflicts
    const dayEvents = events.filter(event => event.date === newEvent.date && event.id !== newEvent.id);
    const hasConflict = dayEvents.some(event => hasTimeConflict(event, newEvent));

    if (hasConflict) {
      alert('This time slot conflicts with an existing event!');
      return;
    }

    // Update or add the event
    const updatedEvents = eventToEdit
      ? events.map(event => (event.id === eventToEdit.id ? newEvent : event))
      : [...events, newEvent];

    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    onOpenChange(false);
    window.location.reload(); // Refresh to update the calendar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? 'Edit Event' : 'Add Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Category</Label>
            <Select
              value={formData.color}
              onValueChange={value => setFormData({ ...formData, color: value as Event['color'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {eventToEdit ? 'Update' : 'Add'} Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}