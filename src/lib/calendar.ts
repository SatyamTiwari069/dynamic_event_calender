import { CalendarDay, Event } from '@/types';

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];
  
  // Get stored events
  const storedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]') as Event[];
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      events: storedEvents.filter(event => isSameDay(new Date(event.date), date))
    });
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      events: storedEvents.filter(event => isSameDay(new Date(event.date), date))
    });
  }

  // Add days from next month
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      events: storedEvents.filter(event => isSameDay(new Date(event.date), date))
    });
  }

  return days;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function hasTimeConflict(event1: Event, event2: Event): boolean {
  const start1 = new Date(`${event1.date}T${event1.startTime}`);
  const end1 = new Date(`${event1.date}T${event1.endTime}`);
  const start2 = new Date(`${event2.date}T${event2.startTime}`);
  const end2 = new Date(`${event2.date}T${event2.endTime}`);

  return start1 < end2 && end1 > start2;
}