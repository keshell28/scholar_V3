import { create } from 'zustand';
import { Event } from '../types';

interface EventStore {
  events: Event[];
  userEvents: Event[]; // Events user is attending
  addEvent: (event: Event) => void;
  rsvpEvent: (eventId: string, userId: string, status: 'attending' | 'interested') => void;
  cancelRsvp: (eventId: string, userId: string) => void;
  deleteEvent: (eventId: string) => void;
}

// Mock events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Welcome Braai for New Students',
    description: 'Join us for a traditional South African braai to welcome all new students! Meet fellow Zimbabweans and enjoy great food.',
    category: 'meetup',
    date: new Date('2026-02-15'),
    time: '18:00',
    location: 'University Commons',
    isOnline: false,
    organizerId: '1',
    organizerName: 'Tendai Moyo',
    organizerImage: 'https://i.pravatar.cc/150?img=12',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    maxAttendees: 50,
    attendees: ['1', '2', '3'],
    interested: ['4', '5'],
    createdAt: new Date('2026-01-20'),
    tags: ['food', 'social', 'networking'],
    university: 'University of Cape Town',
    isPaid: false,
  },
  {
    id: '2',
    title: 'Independence Day Celebration',
    description: 'Celebrate Zimbabwe Independence Day with traditional music, dance, and food. All Zimbabweans welcome!',
    category: 'cultural',
    date: new Date('2026-04-18'),
    time: '14:00',
    location: 'Student Center Hall',
    isOnline: false,
    organizerId: '2',
    organizerName: 'Chipo Ndlovu',
    organizerImage: 'https://i.pravatar.cc/150?img=45',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    attendees: ['2', '5'],
    interested: ['1', '3', '4', '6'],
    createdAt: new Date('2026-01-25'),
    tags: ['cultural', 'celebration', 'zimbabwe'],
    isPaid: false,
  },
  {
    id: '3',
    title: 'Study Skills Workshop',
    description: 'Learn effective study techniques and time management strategies from senior students.',
    category: 'academic',
    date: new Date('2026-02-05'),
    time: '16:00',
    location: 'Online',
    isOnline: true,
    organizerId: '3',
    organizerName: 'Runako Sibanda',
    organizerImage: 'https://i.pravatar.cc/150?img=33',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    maxAttendees: 100,
    attendees: ['1', '3', '4', '5', '6'],
    interested: ['2'],
    createdAt: new Date('2026-01-22'),
    tags: ['academic', 'workshop', 'skills'],
    isPaid: false,
  },
  {
    id: '4',
    title: 'Football Match: Zim Students vs SA Students',
    description: 'Friendly football match followed by a social gathering. Show your national pride!',
    category: 'sports',
    date: new Date('2026-02-10'),
    time: '15:00',
    location: 'Campus Sports Field',
    isOnline: false,
    organizerId: '4',
    organizerName: 'Tatenda Mapfumo',
    organizerImage: 'https://i.pravatar.cc/150?img=22',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    attendees: ['4', '6'],
    interested: ['1', '2', '3', '5'],
    createdAt: new Date('2026-01-26'),
    tags: ['sports', 'football', 'social'],
    university: 'University of Johannesburg',
    isPaid: false,
  },
];

export const useEventStore = create<EventStore>((set) => ({
  events: mockEvents,
  userEvents: [],

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),

  rsvpEvent: (eventId, userId, status) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              attendees:
                status === 'attending'
                  ? [...new Set([...event.attendees, userId])]
                  : event.attendees.filter((id) => id !== userId),
              interested:
                status === 'interested'
                  ? [...new Set([...event.interested, userId])]
                  : event.interested.filter((id) => id !== userId),
            }
          : event
      ),
    })),

  cancelRsvp: (eventId, userId) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              attendees: event.attendees.filter((id) => id !== userId),
              interested: event.interested.filter((id) => id !== userId),
            }
          : event
      ),
    })),

  deleteEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    })),
}));
